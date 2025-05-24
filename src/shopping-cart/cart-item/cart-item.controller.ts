import {
  Controller,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { CartItemService } from './cart-item.service';

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

  @Get('cart/:cartId')
  getItems(@Param('cartId') cartId: number) {
    return this.cartItemService.findByCart(cartId);
  }
}
