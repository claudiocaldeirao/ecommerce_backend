import { Injectable } from '@nestjs/common';
import { PaymentAdapter } from './payment-adapter.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentAdapter: PaymentAdapter) {}

  async createPayment(
    orderId: string,
    amount: number,
    currency: string = 'usd',
  ) {
    return this.paymentAdapter.createPaymentIntent(orderId, amount, currency);
  }
}
