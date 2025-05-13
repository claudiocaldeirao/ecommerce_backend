import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '@/shopping-cart/cart/cart.module';
import { CartItem } from '@/shopping-cart/cart-item/entity/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), CartModule],
})
export class CartItemModule {}
