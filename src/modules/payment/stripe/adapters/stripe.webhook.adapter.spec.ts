import { Test, TestingModule } from '@nestjs/testing';
import { StripeWebhookAdapter } from './stripe.webhook.adapter';
import { StripeService } from '../stripe.service';
import { OrderService } from '@/modules/order/order.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import Stripe from 'stripe';

describe('StripeWebhookAdapter', () => {
  let adapter: StripeWebhookAdapter;
  let stripeService: jest.Mocked<StripeService>;
  let orderService: jest.Mocked<OrderService>;
  let response: jest.Mocked<FastifyReply>;
  let request: Partial<FastifyRequest>;

  const mockPaymentIntent = {
    metadata: {
      orderId: 'order-123',
    },
  };

  const makeEvent = (
    type:
      | 'payment_intent.succeeded'
      | 'payment_intent.payment_failed'
      | 'payment_intent.canceled'
      | 'payment_method.attached', // unhandled event
  ): Stripe.Event => ({
    id: 'evt_test',
    type,
    object: 'event',
    api_version: '2025-05-28.basil',
    data: { object: mockPaymentIntent } as any,
    created: Date.now(),
    livemode: false,
    pending_webhooks: 1,
    request: { id: 'req_123', idempotency_key: null },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeWebhookAdapter,
        {
          provide: StripeService,
          useValue: {
            constructEvent: jest.fn(),
          },
        },
        {
          provide: OrderService,
          useValue: {
            markOrderAsPaid: jest.fn(),
            markOrderAsFailed: jest.fn(),
            markOrderAsCancelled: jest.fn(),
          },
        },
      ],
    }).compile();

    adapter = module.get(StripeWebhookAdapter);
    stripeService = module.get(StripeService);
    orderService = module.get(OrderService);

    response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    request = {
      headers: { 'stripe-signature': 'sig_test' },
    };
  });

  it('should handle payment_intent.succeeded', async () => {
    stripeService.constructEvent.mockResolvedValue(
      makeEvent('payment_intent.succeeded'),
    );

    await adapter.handleWebhook(
      request as FastifyRequest,
      response,
      'raw-body',
    );

    expect(orderService.markOrderAsPaid).toHaveBeenCalledWith('order-123');
    expect(response.send).toHaveBeenCalledWith({ received: true });
  });

  it('should handle payment_intent.payment_failed', async () => {
    stripeService.constructEvent.mockResolvedValue(
      makeEvent('payment_intent.payment_failed'),
    );

    await adapter.handleWebhook(
      request as FastifyRequest,
      response,
      'raw-body',
    );

    expect(orderService.markOrderAsFailed).toHaveBeenCalledWith('order-123');
    expect(response.send).toHaveBeenCalledWith({ received: true });
  });

  it('should handle payment_intent.canceled', async () => {
    stripeService.constructEvent.mockResolvedValue(
      makeEvent('payment_intent.canceled'),
    );

    await adapter.handleWebhook(
      request as FastifyRequest,
      response,
      'raw-body',
    );

    expect(orderService.markOrderAsCancelled).toHaveBeenCalledWith('order-123');
    expect(response.send).toHaveBeenCalledWith({ received: true });
  });

  it('should handle missing metadata.orderId', async () => {
    const invalidPaymentIntent = { metadata: {} };
    stripeService.constructEvent.mockResolvedValue({
      ...makeEvent('payment_intent.succeeded'),
      data: { object: invalidPaymentIntent } as any,
    });

    await adapter.handleWebhook(
      request as FastifyRequest,
      response,
      'raw-body',
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith('Missing metadata "orderId"');
  });

  it('should handle unknown event type', async () => {
    stripeService.constructEvent.mockResolvedValue(
      makeEvent('payment_method.attached'),
    );

    await adapter.handleWebhook(
      request as FastifyRequest,
      response,
      'raw-body',
    );

    expect(response.send).toHaveBeenCalledWith({ received: true });
    expect(orderService.markOrderAsPaid).not.toHaveBeenCalled();
    expect(orderService.markOrderAsFailed).not.toHaveBeenCalled();
    expect(orderService.markOrderAsCancelled).not.toHaveBeenCalled();
  });
});
