import Decimal from 'decimal.js';

export function calculateTotalAmount(
  cartItems: { product: { price: number }; quantity: number }[],
): number {
  const total = cartItems.reduce((acc, item) => {
    return acc.plus(new Decimal(item.product.price).times(item.quantity));
  }, new Decimal(0));
  return total.toNumber();
}
