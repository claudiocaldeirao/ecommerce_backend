import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CheckStockDto } from './dto/check-stock.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(data: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async validateStock(cartItems: CheckStockDto[]): Promise<void> {
    for (const item of cartItems) {
      const product = await this.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}`);
      }
    }
  }
}
