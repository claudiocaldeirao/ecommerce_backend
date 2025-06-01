import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { PaymentService } from './payment.service';
import {
  PaymentAdapter,
  PaymentIntentResponse,
} from './payment-adapter.interface';
import { OrderRecord } from '../order/entity/order-record.entity';
import { OrderInvoice } from '../order/entity/order-invoice.entity';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let paymentAdapter: jest.Mocked<PaymentAdapter>;
  let mockOrderRepo: jest.Mocked<Repository<OrderRecord>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(OrderRecord),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    mockOrderRepo = module.get(getRepositoryToken(OrderRecord));

    paymentAdapter = {
      createPaymentIntent: jest.fn(),
    };

    paymentService = new PaymentService(paymentAdapter, mockOrderRepo);
  });

  it('should create a payment using adapter', async () => {
    const mockResponse: PaymentIntentResponse = {
      id: 'pi_456',
      clientSecret: 'secret_key',
      status: 'processing',
    };

    const order: OrderRecord = {
      transaction: {
        total_amount: 2000,
        id: '',
        description: '',
        order: new OrderRecord(),
      },
      id: '',
      user_id: '',
      date: undefined,
      status: 'pending_payment',
      invoice: new OrderInvoice(),
      items: [],
    };

    paymentAdapter.createPaymentIntent.mockResolvedValue(mockResponse);
    jest.spyOn(mockOrderRepo, 'findOne').mockResolvedValue(order);

    const result = await paymentService.createPayment('order_001');
    expect(result).toEqual(mockResponse);
    expect(paymentAdapter.createPaymentIntent).toHaveBeenCalledWith(
      'order_001',
      2000,
      'usd',
    );
  });
});
