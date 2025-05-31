import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '@/modules/product/entity/product.entity';
import { OrderRecord } from '@/modules/order/entity/order-record.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderRecord, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_record_id' })
  order: OrderRecord;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
