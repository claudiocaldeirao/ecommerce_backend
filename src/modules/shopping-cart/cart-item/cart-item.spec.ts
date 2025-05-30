import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { CartItem } from './entity/cart-item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/user/entity/user.entity';
import { Product } from '@/modules/product/entity/product.entity';
import { Cart } from '../cart/entity/cart.entity';

describe('CartItemService', () => {
  let service: CartItemService;
  let cartItemRepo: jest.Mocked<Repository<CartItem>>;
  let cartRepo: jest.Mocked<Repository<Cart>>;
  let productRepo: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: getRepositoryToken(CartItem),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    cartItemRepo = module.get(getRepositoryToken(CartItem));
    cartRepo = module.get(getRepositoryToken(Cart));
    productRepo = module.get(getRepositoryToken(Product));
  });

  describe('upsertItem', () => {
    it('should update existing item', async () => {
      const cart = { id: 1 } as Cart;
      const product = { id: 2 } as Product;
      const existingItem = { id: 1, cart, product, quantity: 1 };

      cartRepo.findOneBy.mockResolvedValue(cart);
      productRepo.findOneBy.mockResolvedValue(product);
      cartItemRepo.findOne.mockResolvedValue(existingItem);
      cartItemRepo.save.mockResolvedValue({ ...existingItem, quantity: 5 });

      const result = await service.upsertItem(1, 2, 5);

      expect(cartItemRepo.save).toHaveBeenCalledWith({
        ...existingItem,
        quantity: 5,
      });
      expect(result.quantity).toBe(5);
    });

    it('should create a new item if it does not exist', async () => {
      const cart = { id: 1 } as Cart;
      const product = { id: 2 } as Product;

      cartRepo.findOneBy.mockResolvedValue(cart);
      productRepo.findOneBy.mockResolvedValue(product);
      cartItemRepo.findOne.mockResolvedValue(null);
      cartItemRepo.create.mockReturnValue({
        id: 1,
        cart,
        product,
        quantity: 3,
      });
      cartItemRepo.save.mockResolvedValue({
        id: 10,
        cart,
        product,
        quantity: 3,
      });

      const result = await service.upsertItem(1, 2, 3);

      expect(cartItemRepo.create).toHaveBeenCalledWith({
        cart,
        product,
        quantity: 3,
      });
      expect(result.id).toBe(10);
    });
  });

  describe('updateItem', () => {
    it('should call update with correct params', async () => {
      cartItemRepo.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      });

      const result = await service.updateItem(5, 10);

      expect(cartItemRepo.update).toHaveBeenCalledWith(5, { quantity: 10 });
      expect(result.affected).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('should call delete with correct itemId', async () => {
      cartItemRepo.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.removeItem(7);

      expect(cartItemRepo.delete).toHaveBeenCalledWith(7);
      expect(result.affected).toBe(1);
    });
  });

  describe('findByCart', () => {
    it('should return cart items with product relation', async () => {
      const items: CartItem[] = [
        {
          id: 1,
          quantity: 2,
          product: {
            id: 3,
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: '',
          },
          cart: {
            id: 1,
            user: new User(),
          },
        },
        {
          id: 2,
          quantity: 1,
          product: {
            id: 4,
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: '',
          },
          cart: {
            id: 2,
            user: new User(),
          },
        },
      ];
      cartItemRepo.find.mockResolvedValue(items);

      const result = await service.findByCart(1);

      expect(cartItemRepo.find).toHaveBeenCalledWith({
        where: { cart: { id: 1 } },
        relations: ['product'],
      });
      expect(result).toEqual(items);
    });
  });
});
