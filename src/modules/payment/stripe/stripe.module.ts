import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeAdapter } from './stripe.adapter';
import { StripeWebhookAdapter } from './adapters/stripe.webhook.adapter';

@Module({
  providers: [StripeService, StripeAdapter, StripeWebhookAdapter],
  exports: [StripeAdapter, StripeWebhookAdapter],
})
export class StripeModule {}
