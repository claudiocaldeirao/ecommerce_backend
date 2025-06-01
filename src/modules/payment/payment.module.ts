import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeModule } from './stripe/stripe.module';
import { StripeAdapter } from './stripe/stripe.adapter';
import { OrderRecord } from '../order/entity/order-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [StripeModule, TypeOrmModule.forFeature([OrderRecord])],
  controllers: [PaymentController],
  providers: [
    {
      provide: 'PaymentAdapter',
      useExisting: StripeAdapter,
    },
    PaymentService,
  ],
})
export class PaymentModule {}
