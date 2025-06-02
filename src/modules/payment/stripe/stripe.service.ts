import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string = 'usd',
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        orderId: orderId,
      },
    });
  }

  async constructEvent(signature: string | string[], body: string) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }

  async retrievePaymentIntent(id: string) {
    return this.stripe.paymentIntents.retrieve(id);
  }
}
