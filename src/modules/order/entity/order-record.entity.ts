import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { OrderInvoice } from './order-invoice.entity';
import { OrderTransaction } from './order-transaction.entity';

@Entity('order_record')
export class OrderRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @CreateDateColumn()
  date: Date;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'PAID' | 'CANCELLED';

  @OneToOne(() => OrderInvoice, (invoice) => invoice.order, { cascade: true })
  invoice: OrderInvoice;

  @OneToOne(() => OrderTransaction, (transaction) => transaction.order, {
    cascade: true,
  })
  transaction: OrderTransaction;
}
