import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from '@/shopping-cart/cart/cart.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId')
  createCart(@Param('userId') userId: string) {
    return this.cartService.create(userId);
  }

  @Get('user/:userId')
  getCartByUser(@Param('userId') userId: string) {
    return this.cartService.findByUser(userId);
  }

  @Delete(':id')
  deleteCart(@Param('id') id: number) {
    return this.cartService.remove(id);
  }
}
