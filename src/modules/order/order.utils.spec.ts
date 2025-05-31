import { calculateTotalAmount } from './order.utils';

describe('calculateTotalAmount', () => {
  it('should correctly sum prices and quantities without float precision errors', () => {
    const cartItems = [
      { product: { price: 0.1 }, quantity: 1 },
      { product: { price: 0.2 }, quantity: 1 },
    ];

    const result = calculateTotalAmount(cartItems);
    expect(result).toBeCloseTo(0.3, 10);
  });

  it('should handle sums like 0.1 + 0.7 correctly', () => {
    const cartItems = [
      { product: { price: 0.1 }, quantity: 1 },
      { product: { price: 0.7 }, quantity: 1 },
    ];

    const result = calculateTotalAmount(cartItems);
    expect(result).toBeCloseTo(0.8, 10);
  });

  it('should calculate total for multiple quantities', () => {
    const cartItems = [
      { product: { price: 1.25 }, quantity: 2 },
      { product: { price: 2.5 }, quantity: 3 },
    ];

    const result = calculateTotalAmount(cartItems);
    expect(result).toBeCloseTo(1.25 * 2 + 2.5 * 3, 10);
  });

  it('should return 0 for empty cart', () => {
    const cartItems: { product: { price: number }; quantity: number }[] = [];
    const result = calculateTotalAmount(cartItems);
    expect(result).toBe(0);
  });
});
