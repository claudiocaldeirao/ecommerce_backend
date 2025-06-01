import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderRecord } from './entity/order-record.entity';
import { OrderItem } from './entity/order-item.entity';
import { OrderTransaction } from './entity/order-transaction.entity';
import { OrderInvoice } from './entity/order-invoice.entity';
import { Cart } from '../shopping-cart/cart/entity/cart.entity';
import { CartItem } from '../shopping-cart/cart-item/entity/cart-item.entity';
import { orderStatus } from './constants/order-status.constant';
import { DataSource } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrderItemRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTransactionRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockInvoiceRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCartRepo = {
    findOne: jest.fn(),
  };

  const mockCartItemRepo = {
    find: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(OrderRecord), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepo },
        {
          provide: getRepositoryToken(OrderTransaction),
          useValue: mockTransactionRepo,
        },
        {
          provide: getRepositoryToken(OrderInvoice),
          useValue: mockInvoiceRepo,
        },
        { provide: getRepositoryToken(Cart), useValue: mockCartRepo },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepo },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);

    jest.clearAllMocks();
  });

  describe('checkoutFromCart', () => {
    it('should throw NotFoundException if cart not found', async () => {
      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          getRepository: (entity) => {
            if (entity === Cart) {
              return entity.findOne.mockResolvedValue(null);
            }

            throw new Error(`No mock defined for repository of: ${entity}`);
          },
        };

        return callback(mockManager);
      });

      await expect(service.checkoutFromCart('user-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCartRepo.findOne).toHaveBeenCalledWith({
        where: { user: { id: 'user-id' } },
        relations: ['user'],
      });
    });

    it('should throw BadRequestException if cart is empty', async () => {
      mockCartRepo.findOne.mockResolvedValue({ id: 1 });
      mockCartItemRepo.find.mockResolvedValue([]);

      await expect(service.checkoutFromCart('user-id')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockCartItemRepo.find).toHaveBeenCalledWith({
        where: { cart: { id: 1 } },
        relations: ['product'],
      });
    });

    it('should create order, order items, transaction and clear cart', async () => {
      const userId = 'user-id';
      const cart = { id: 1, user: { id: userId } };
      const cartItems = [
        { product: { id: 101, price: 10 }, quantity: 2 },
        { product: { id: 102, price: 5 }, quantity: 1 },
      ];
      const savedOrder = {
        id: 'order-id',
        user_id: userId,
        status: orderStatus.PROCESSING,
      };
      const savedOrderWithRelations = {
        ...savedOrder,
        transaction: {},
        invoice: {},
      };

      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          getRepository: (cartEntity) => {
            cartEntity.findOne.mockResolvedValue(null);
          },
        };

        return callback(mockManager);
      });

      mockCartRepo.findOne.mockResolvedValue(cart);
      mockCartItemRepo.find.mockResolvedValue(cartItems);
      mockOrderRepo.create.mockReturnValue(savedOrder);
      mockOrderRepo.save.mockResolvedValue(savedOrder);
      mockOrderItemRepo.create.mockImplementation((item) => item);
      mockOrderItemRepo.save.mockResolvedValue(cartItems);
      mockTransactionRepo.create.mockImplementation((obj) => obj);
      mockTransactionRepo.save.mockResolvedValue({});
      mockCartItemRepo.delete.mockResolvedValue({});
      mockOrderRepo.findOne.mockResolvedValue(savedOrderWithRelations);

      mockDataSource.transaction.mockImplementation(async (callback) => {
        const mockManager = {
          getRepository: (entity) => {
            switch (entity) {
              case Cart:
                return mockCartRepo;
              case CartItem:
                return mockCartItemRepo;
              case OrderRecord:
                return mockOrderRepo;
              case OrderItem:
                return mockOrderItemRepo;
              case OrderTransaction:
                return mockTransactionRepo;
              case OrderInvoice:
                return mockInvoiceRepo;
              default:
                throw new Error(`No mock defined for repository of: ${entity}`);
            }
          },
        };

        return callback(mockManager);
      });

      const result = await service.checkoutFromCart(userId);

      const totalAmount = 10 * 2 + 5 * 1;

      expect(result).toEqual(savedOrderWithRelations);
      expect(mockOrderRepo.create).toHaveBeenCalledWith({
        user_id: userId,
        status: orderStatus.PROCESSING,
      });
      expect(mockOrderRepo.save).toHaveBeenCalledWith(savedOrder);
      expect(mockOrderItemRepo.create).toHaveBeenCalledTimes(cartItems.length);
      expect(mockOrderItemRepo.save).toHaveBeenCalledWith(expect.any(Array));
      expect(mockTransactionRepo.create).toHaveBeenCalledWith({
        order: savedOrder,
        total_amount: totalAmount,
        description: `Pedido #${savedOrder.id}`,
      });
      expect(mockTransactionRepo.save).toHaveBeenCalled();
      expect(mockCartItemRepo.delete).toHaveBeenCalledWith({
        cart: { id: cart.id },
      });
      expect(mockOrderRepo.findOne).toHaveBeenCalledWith({
        where: { id: savedOrder.id },
        relations: ['transaction', 'invoice'],
      });
    });
  });

  describe('basic methods', () => {
    it('should call orderRepo.findAll', async () => {
      const orders = [{ id: '1' }];
      mockOrderRepo.find.mockResolvedValue(orders);
      const result = await service.findAll();
      expect(result).toEqual(orders);
      expect(mockOrderRepo.find).toHaveBeenCalledWith({
        relations: ['invoice', 'transaction'],
      });
    });

    it('should call orderRepo.findOne', async () => {
      const order = { id: '1' };
      mockOrderRepo.findOne.mockResolvedValue(order);
      const result = await service.findOne('1');
      expect(result).toEqual(order);
      expect(mockOrderRepo.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['invoice', 'transaction'],
      });
    });

    it('should update order and return updated', async () => {
      mockOrderRepo.update.mockResolvedValue(undefined);
      const updatedOrder: OrderRecord = {
        id: '1',
        user_id: '123456',
        date: undefined,
        status: orderStatus.PROCESSING,
        invoice: new OrderInvoice(),
        transaction: new OrderTransaction(),
        items: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedOrder);

      const result = await service.update('1', {
        status: orderStatus.DELIVERED,
      });
      expect(mockOrderRepo.update).toHaveBeenCalledWith('1', {
        status: orderStatus.DELIVERED,
      });
      expect(result).toEqual(updatedOrder);
    });

    it('should remove order', async () => {
      mockOrderRepo.delete.mockResolvedValue(undefined);
      await service.remove('1');
      expect(mockOrderRepo.delete).toHaveBeenCalledWith('1');
    });
  });
});
