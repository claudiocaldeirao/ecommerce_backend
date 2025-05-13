import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from '@/shopping-cart/cart/entity/cart.entity';
import { Product } from '@/product/entity/product.entity';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;

  @ManyToOne(() => Cart, { nullable: false })
  cart: Cart;

  @Column('int')
  quantity: number;
}
