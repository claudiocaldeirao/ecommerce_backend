import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from './stripe/stripe.module';
import { StripeAdapter } from './stripe/adapters/stripe.adapter';
import { OrderRecord } from '../order/entity/order-record.entity';
import { StripeWebhookAdapter } from './stripe/adapters/stripe.webhook.adapter';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([OrderRecord])],
  controllers: [PaymentController, WebhookController],
  providers: [
    {
      provide: 'PaymentAdapter',
      useExisting: StripeAdapter,
    },
    {
      provide: 'WebhookAdapter',
      useExisting: StripeWebhookAdapter,
    },
    PaymentService,
  ],
})
export class PaymentModule {}
