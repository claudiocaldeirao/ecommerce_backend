import { PaymentService } from './payment.service';
import {
  PaymentAdapter,
  PaymentIntentResponse,
} from './payment-adapter.interface';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let paymentAdapter: jest.Mocked<PaymentAdapter>;

  beforeEach(() => {
    paymentAdapter = {
      createPaymentIntent: jest.fn(),
    };
    paymentService = new PaymentService(paymentAdapter);
  });

  it('should create a payment using adapter', async () => {
    const mockResponse: PaymentIntentResponse = {
      id: 'pi_456',
      clientSecret: 'secret_key',
      status: 'processing',
    };

    paymentAdapter.createPaymentIntent.mockResolvedValue(mockResponse);

    const result = await paymentService.createPayment(2000);
    expect(result).toEqual(mockResponse);
    expect(paymentAdapter.createPaymentIntent).toHaveBeenCalledWith(
      2000,
      'usd',
    );
  });
});
