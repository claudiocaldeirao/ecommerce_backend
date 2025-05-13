import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entity/cart-item.entity';
import { Cart } from '@/shopping-cart/cart/entity/cart.entity';
import { Product } from '@/product/entity/product.entity';

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

  async addItem(cartId: number, productId: number, quantity: number) {
    const cart = await this.cartRepo.findOneBy({ id: cartId });
    const product = await this.productRepo.findOneBy({ id: productId });
    const item = this.cartItemRepo.create({ cart, product, quantity });
    return this.cartItemRepo.save(item);
  }

  updateItem(itemId: number, quantity: number) {
    return this.cartItemRepo.update(itemId, { quantity });
  }

  removeItem(itemId: number) {
    return this.cartItemRepo.delete(itemId);
  }

  findByCart(cartId: number) {
    return this.cartItemRepo.find({
      where: { cart: { id: cartId } },
      relations: ['product'],
    });
  }
}
