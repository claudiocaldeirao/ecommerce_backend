import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 100,
  description: 'A test product',
} as Product;

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get(getRepositoryToken(Product));
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      repo.find.mockResolvedValue([mockProduct]);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      repo.findOneBy.mockResolvedValue(mockProduct);
      const result = await service.findOne(1);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        description: 'New description',
        price: 50,
        stock: 5,
        category: 'Product Category',
      };
      const createdProduct = { ...createDto, id: 2 } as Product;

      repo.create.mockReturnValue(createdProduct);
      repo.save.mockResolvedValue(createdProduct);

      const result = await service.create(createDto);
      expect(repo.create).toHaveBeenCalledWith(createDto);
      expect(repo.save).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const updateDto: UpdateProductDto = { name: 'Updated Name' };
      const updatedProduct = { ...mockProduct, ...updateDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);
      repo.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repo.save).toHaveBeenCalledWith(updatedProduct);
      expect(result).toEqual(updatedProduct);
    });
  });
});
