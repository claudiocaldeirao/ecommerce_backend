import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentAdapter } from './payment-adapter.interface';
import { OrderRecord } from '../order/entity/order-record.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

    return this.paymentAdapter.createPaymentIntent(
      orderId,
      order.transaction.total_amount,
      currency,
    );
  }
}
