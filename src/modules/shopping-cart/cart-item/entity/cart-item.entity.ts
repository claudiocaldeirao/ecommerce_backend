import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '@/modules/product/entity/product.entity';
import { Cart } from '../../cart/entity/cart.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Cart, { nullable: false })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column('int')
  quantity: number;
}
