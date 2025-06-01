export interface PaymentIntentResponse {
  id: string;
  clientSecret: string | null;
  status: string;
}

export interface PaymentAdapter {
  createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<PaymentIntentResponse>;
}
