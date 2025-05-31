import { OrderStatus } from '../constants/order-status.constant';

export class UpdateOrderDto {
  status?: OrderStatus;
}
