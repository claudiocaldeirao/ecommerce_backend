import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { OrderInvoice } from './order-invoice.entity';
import { OrderTransaction } from './order-transaction.entity';
import { OrderItem } from './order-item.entity';

@Entity('order_record')
export class OrderRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'processing' })
  status: 'processing' | 'delivered' | 'shipped' | 'cancelled';

  @OneToOne(() => OrderInvoice, (invoice) => invoice.order)
  invoice: OrderInvoice;

  @OneToOne(() => OrderTransaction, (transaction) => transaction.order)
  transaction: OrderTransaction;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}
