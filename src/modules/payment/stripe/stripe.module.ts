import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeAdapter } from './stripe.adapter';

@Module({
  providers: [StripeService, StripeAdapter],
  exports: [StripeAdapter],
})
export class StripeModule {}
