import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { OrderRecord } from './order-record.entity';

@Entity('order_invoice')
export class OrderInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => OrderRecord, (order) => order.invoice)
  @JoinColumn()
  order: OrderRecord;
}
