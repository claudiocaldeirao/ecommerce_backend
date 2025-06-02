import { Injectable, Logger } from '@nestjs/common';
import { WebhookAdapter } from '../../adapters/webhook.adapter';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StripeService } from '../stripe.service';
import { OrderService } from '@/modules/order/order.service';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookAdapter implements WebhookAdapter {
  constructor(
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
  ) {}

  async handleWebhook(
    request: FastifyRequest,
    response: FastifyReply,
    rawBody: string,
  ): Promise<void> {
    const signature = request.headers['stripe-signature'];
    const event = await this.stripeService.constructEvent(signature, rawBody);
    const paymentIntent = event.data.object;
    const { metadata } = paymentIntent as Stripe.PaymentIntent;

    if (!metadata.orderId) {
      Logger.error('Missing orderId');
      response.status(400).send('Missing metadata "orderId"');
      return;
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        this.orderService.markOrderAsPaid(metadata.orderId);
        break;
      case 'payment_intent.payment_failed':
        this.orderService.markOrderAsFailed(metadata.orderId);
        break;
      case 'payment_intent.canceled':
        this.orderService.markOrderAsCancelled(metadata.orderId);
        break;
      default:
        Logger.warn(`Unhandled event type ${event.type}`);
    }

    response.send({ received: true });
  }
}
