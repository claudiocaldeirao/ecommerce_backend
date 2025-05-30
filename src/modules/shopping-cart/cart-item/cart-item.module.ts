import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/product/entity/product.entity';
import { CartModule } from '../cart/cart.module';
import { Cart } from '../cart/entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';

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
