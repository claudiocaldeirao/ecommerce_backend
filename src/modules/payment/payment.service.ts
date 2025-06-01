import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentAdapter } from './payment-adapter.interface';
import { OrderRecord } from '../order/entity/order-record.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentAdapter')
    private readonly paymentAdapter: PaymentAdapter,
    @InjectRepository(OrderRecord)
    private orderRepository: Repository<OrderRecord>,
  ) {}

  async createPayment(orderId: string, currency: string = 'usd') {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['transaction'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const amountDecimal = new Decimal(order.transaction.total_amount);
    const amountInteger = amountDecimal.mul(100).toDecimalPlaces(0).toNumber();

    return this.paymentAdapter.createPaymentIntent(
      orderId,
      amountInteger,
      currency,
    );
  }
}
