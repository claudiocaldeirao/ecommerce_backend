import { Injectable } from '@nestjs/common';
import { PaymentAdapter } from './payment-adapter.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentAdapter: PaymentAdapter) {}

  async createPayment(amount: number, currency: string = 'usd') {
    return this.paymentAdapter.createPaymentIntent(amount, currency);
  }
}
