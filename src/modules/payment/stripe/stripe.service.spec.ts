import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

jest.mock('stripe');

describe('StripeService', () => {
  let service: StripeService;
  let createMock: jest.Mock;
  let retrieveMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn();
    retrieveMock = jest.fn();

    const StripeMockConstructor = Stripe as unknown as jest.Mock;

    StripeMockConstructor.mockImplementation(() => ({
      paymentIntents: {
        create: createMock,
        retrieve: retrieveMock,
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
});
