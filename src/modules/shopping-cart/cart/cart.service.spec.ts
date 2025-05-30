import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';

describe('CartService', () => {
  let service: CartService;
  let repository: jest.Mocked<Repository<Cart>>;

  const mockCart = {
    id: 1,
    user: { id: 'user-id-123' },
  } as Cart;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    repository = module.get(getRepositoryToken(Cart));
  });

  describe('create', () => {
    it('should create and save a new cart for the user', async () => {
      repository.create.mockReturnValue(mockCart);
      repository.save.mockResolvedValue(mockCart);

      const result = await service.create('user-id-123');

      expect(repository.create).toHaveBeenCalledWith({
        user: { id: 'user-id-123' },
      });
      expect(repository.save).toHaveBeenCalledWith(mockCart);
      expect(result).toEqual(mockCart);
    });
  });

  describe('findByUser', () => {
    it('should return a cart for the given user ID', async () => {
      repository.findOne.mockResolvedValue(mockCart);

      const result = await service.findByUser('user-id-123');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 'user-id-123' } },
        relations: ['user'],
      });
      expect(result).toEqual(mockCart);
    });
  });

  describe('findById', () => {
    it('should return a cart for the given cart ID', async () => {
      repository.findOne.mockResolvedValue(mockCart);

      const result = await service.findById(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(result).toEqual(mockCart);
    });
  });

  describe('remove', () => {
    it('should delete the cart with the given ID', async () => {
      repository.delete.mockResolvedValue({ affected: 1, raw: mockCart });

      const result = await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1, raw: mockCart });
    });
  });
});
