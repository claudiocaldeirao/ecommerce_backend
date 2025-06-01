import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from './stripe/stripe.module';
import { StripeAdapter } from './stripe/stripe.adapter';

@Module({
  imports: [StripeModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'PaymentAdapter',
      useExisting: StripeAdapter,
    },
  ],
})
export class PaymentModule {}
