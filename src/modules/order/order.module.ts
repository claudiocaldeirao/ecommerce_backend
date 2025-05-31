import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRecord } from './entity/order-record.entity';
import { OrderInvoice } from './entity/order-invoice.entity';
import { OrderTransaction } from './entity/order-transaction.entity';
import { OrderItem } from './entity/order-item.entity';
import { CartItem } from '../shopping-cart/cart-item/entity/cart-item.entity';
import { Cart } from '../shopping-cart/cart/entity/cart.entity';

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
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
