import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';
import {
  PaymentAdapter,
  PaymentIntentResponse,
} from '../payment-adapter.interface';

@Injectable()
export class StripeAdapter implements PaymentAdapter {
  constructor(private readonly stripeService: StripeService) {}

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<PaymentIntentResponse> {
    const intent = await this.stripeService.createPaymentIntent(
      amount,
      currency,
    );
    return {
      id: intent.id,
      clientSecret: intent.client_secret,
      status: intent.status,
    };
  }
}
