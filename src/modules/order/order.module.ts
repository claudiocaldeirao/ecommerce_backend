import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRecord } from './entity/order-record.entity';
import { OrderInvoice } from './entity/order-invoice.entity';
import { OrderTransaction } from './entity/order-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRecord, OrderInvoice, OrderTransaction]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
