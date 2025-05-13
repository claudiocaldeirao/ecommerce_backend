import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '@/shopping-cart/cart/cart.module';
import { CartItem } from '@/shopping-cart/cart-item/entity/cart-item.entity';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { Cart } from '@/shopping-cart/cart/entity/cart.entity';
import { Product } from '@/product/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    TypeOrmModule.forFeature([Cart]),
    TypeOrmModule.forFeature([Product]),
    CartModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
