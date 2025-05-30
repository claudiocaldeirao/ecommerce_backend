import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  create(userId: string) {
    const cart = this.cartRepository.create({ user: { id: userId } });
    return this.cartRepository.save(cart);
  }

  findByUser(userId: string) {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  findById(id: number) {
    return this.cartRepository.findOne({ where: { id }, relations: ['user'] });
  }

  remove(id: number) {
    return this.cartRepository.delete(id);
  }
}
