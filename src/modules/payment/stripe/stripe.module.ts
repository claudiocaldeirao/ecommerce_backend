import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeAdapter } from './adapters/stripe.adapter';
import { StripeWebhookAdapter } from './adapters/stripe.webhook.adapter';
import { OrderService } from '@/modules/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRecord } from '@/modules/order/entity/order-record.entity';
import { OrderInvoice } from '@/modules/order/entity/order-invoice.entity';
import { OrderTransaction } from '@/modules/order/entity/order-transaction.entity';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Cart } from '@/modules/shopping-cart/cart/entity/cart.entity';
import { CartItem } from '@/modules/shopping-cart/cart-item/entity/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRecord,
      OrderInvoice,
      OrderTransaction,
      OrderItem,
      Cart,
      CartItem,
    ]),
  ],
  providers: [StripeService, StripeAdapter, StripeWebhookAdapter, OrderService],
  exports: [StripeAdapter, StripeWebhookAdapter],
})
export class StripeModule {}
