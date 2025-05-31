import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderRecord } from './order-record.entity';

@Entity('order_transaction')
export class OrderTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal')
  total_amount: number;

  @Column()
  description: string;

  @OneToOne(() => OrderRecord, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_record_id' })
  order: OrderRecord;
}
