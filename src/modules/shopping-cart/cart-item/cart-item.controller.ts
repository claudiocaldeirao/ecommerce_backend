import {
  Controller,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CartItemService } from '../cart-item/cart-item.service';

@UseGuards(JwtAuthGuard)
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post(':cartId/product/:productId')
  upsertItem(
    @Param('cartId') cartId: number,
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartItemService.upsertItem(cartId, productId, quantity);
  }

  @Patch(':itemId')
  updateItem(
    @Param('itemId') itemId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartItemService.updateItem(itemId, quantity);
  }

  @Delete(':itemId')
  removeItem(@Param('itemId') itemId: number) {
    return this.cartItemService.removeItem(itemId);
  }

  @Delete(':cartId/items')
  removeAllItems(@Param('cartId') cartId: number) {
    return this.cartItemService.removeAllItems(cartId);
  }

  @Get('cart/:cartId')
  getItems(@Param('cartId') cartId: number) {
    return this.cartItemService.findByCart(cartId);
  }
}
