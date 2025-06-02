import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

jest.mock('stripe');

describe('StripeService', () => {
  let service: StripeService;
  let createMock: jest.Mock;
  let retrieveMock: jest.Mock;
  let constructEventMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn();
    retrieveMock = jest.fn();
    constructEventMock = jest.fn();
    const StripeMockConstructor = Stripe as unknown as jest.Mock;

    StripeMockConstructor.mockImplementation(() => ({
      paymentIntents: {
        create: createMock,
        retrieve: retrieveMock,
      },
      webhooks: {
        constructEvent: constructEventMock,
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeService],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a payment intent', async () => {
    const mockResponse = { id: 'pi_123', amount: 1000 };
    createMock.mockResolvedValue(mockResponse);

    const result = await service.createPaymentIntent('order_001', 1000, 'usd');

    expect(createMock).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'usd',
      metadata: {
        orderId: 'order_001',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should retrieve a payment intent', async () => {
    const mockIntent = { id: 'pi_123', amount: 1000 };
    retrieveMock.mockResolvedValue(mockIntent);

    const result = await service.retrievePaymentIntent('pi_123');

    expect(retrieveMock).toHaveBeenCalledWith('pi_123');
    expect(result).toEqual(mockIntent);
  });

  describe('constructEvent', () => {
    const body = '{"id":"evt_123","object":"event"}';
    const signature = 'sig_test';
    const secret = 'whsec_test_secret';

    beforeEach(() => {
      process.env.STRIPE_WEBHOOK_SECRET = secret;
    });

    it('should call stripe.webhooks.constructEvent with correct arguments', async () => {
      const expectedEvent = { id: 'evt_123', object: 'event' };
      constructEventMock.mockReturnValue(expectedEvent);

      const result = await service.constructEvent(signature, body);

      expect(constructEventMock).toHaveBeenCalledWith(body, signature, secret);
      expect(result).toBe(expectedEvent);
    });

    it('should throw an error if constructEvent fails', async () => {
      constructEventMock.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await expect(service.constructEvent(signature, body)).rejects.toThrow(
        'Invalid signature',
      );
    });
  });
});
