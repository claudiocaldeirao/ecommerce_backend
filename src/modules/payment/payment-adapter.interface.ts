export interface PaymentIntentResponse {
  id: string;
  clientSecret: string | null;
  status: string;
}

export interface PaymentAdapter {
  createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string,
  ): Promise<PaymentIntentResponse>;
}
