import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entity/cart-item.entity';
import { Product } from '@/modules/product/entity/product.entity';
import { Cart } from '../cart/entity/cart.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async upsertItem(cartId: number, productId: number, quantity: number) {
    const cart = await this.cartRepo.findOneBy({ id: cartId });
    const product = await this.productRepo.findOneBy({ id: productId });

    const existingItem = await this.cartItemRepo.findOne({
      where: { cart: cart, product: product },
    });

    if (existingItem) {
      existingItem.quantity = quantity;
      return this.cartItemRepo.save(existingItem);
    }

    const item = this.cartItemRepo.create({ cart, product, quantity });
    return this.cartItemRepo.save(item);
  }

  updateItem(itemId: number, quantity: number) {
    return this.cartItemRepo.update(itemId, { quantity });
  }

  removeItem(itemId: number) {
    return this.cartItemRepo.delete(itemId);
  }

  removeAllItems(cartId: number) {
    return this.cartItemRepo.delete({ cart: { id: cartId } });
  }

  findByCart(cartId: number) {
    return this.cartItemRepo.find({
      where: { cart: { id: cartId } },
      relations: ['product'],
    });
  }
}
