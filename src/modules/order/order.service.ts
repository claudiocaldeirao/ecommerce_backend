import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderRecord } from './entity/order-record.entity';
import { OrderTransaction } from './entity/order-transaction.entity';
import { OrderInvoice } from './entity/order-invoice.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Cart } from '../shopping-cart/cart/entity/cart.entity';
import { CartItem } from '../shopping-cart/cart-item/entity/cart-item.entity';
import { OrderItem } from './entity/order-item.entity';
import { calculateTotalAmount } from './order.utils';
import { orderStatus } from './constants/order-status.constant';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderRecord) private orderRepo: Repository<OrderRecord>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderTransaction)
    private transactionRepo: Repository<OrderTransaction>,
    @InjectRepository(OrderInvoice)
    private invoiceRepo: Repository<OrderInvoice>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderRecord> {
    const order = this.orderRepo.create({ user_id: dto.user_id });

    const savedOrder = await this.orderRepo.save(order);

    const transaction = this.transactionRepo.create({
      order: savedOrder,
      total_amount: dto.total_amount,
      description: dto.description,
    });

    const invoice = this.invoiceRepo.create({ order: savedOrder });

    await this.transactionRepo.save(transaction);
    await this.invoiceRepo.save(invoice);

    return savedOrder;
  }

  findAll(): Promise<OrderRecord[]> {
    return this.orderRepo.find({ relations: ['invoice', 'transaction'] });
  }

  findOne(id: string): Promise<OrderRecord> {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['invoice', 'transaction'],
    });
  }

  async update(id: string, dto: UpdateOrderDto): Promise<OrderRecord> {
    await this.orderRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.orderRepo.delete(id);
  }

  async checkoutFromCart(userId: string): Promise<OrderRecord> {
    return await this.dataSource.transaction(async (manager) => {
      const cart = await this.cartRepo.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const cartItems = await this.cartItemRepo.find({
        where: { cart: { id: cart.id } },
        relations: ['product'],
      });

      if (cartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const totalAmount = calculateTotalAmount(cartItems);

      const order = this.orderRepo.create({
        user_id: userId,
        status: orderStatus.PENDING_PAYMENT,
      });

      const savedOrder = await this.orderRepo.save(order);

      const orderItems = cartItems.map((item) =>
        this.orderItemRepo.create({
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        }),
      );

      await this.orderItemRepo.save(orderItems);

      const transaction = this.transactionRepo.create({
        order: savedOrder,
        total_amount: totalAmount,
        description: `Pedido #${savedOrder.id}`,
      });

      await manager.getRepository(OrderTransaction).save(transaction);

      await manager.getRepository(CartItem).delete({ cart: { id: cart.id } });

      return manager.getRepository(OrderRecord).findOne({
        where: { id: savedOrder.id },
        relations: ['transaction', 'invoice'],
      });
    });
  }

  async markOrderAsPaid(orderId: string) {
    const result = await this.orderRepo.update(
      { id: orderId },
      { status: orderStatus.PAID },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
  }

  async markOrderAsCancelled(orderId: string) {
    const result = await this.orderRepo.update(
      { id: orderId },
      { status: orderStatus.CANCELLED },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
  }

  async markOrderAsFailed(orderId: string) {
    const result = await this.orderRepo.update(
      { id: orderId },
      { status: orderStatus.PAYMENT_FAILED },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
  }
}
