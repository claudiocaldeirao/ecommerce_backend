import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';

@Module({
  imports: [CartModule, CartItemModule],
})
export class ShoppingCartModule {}
