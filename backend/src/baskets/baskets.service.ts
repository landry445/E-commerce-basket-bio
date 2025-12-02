import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Basket } from './entities/basket.entity';

@Injectable()
export class BasketsService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
  ) {}

  findAll(): Promise<Basket[]> {
    return this.basketRepo.find();
  }

  async findOne(id: string): Promise<Basket> {
    const basket = await this.basketRepo.findOne({ where: { id } });
    if (!basket) throw new NotFoundException('Panier non trouvé');
    return basket;
  }

  create(data: Partial<Basket>): Promise<Basket> {
    const entity = this.basketRepo.create(data);
    return this.basketRepo.save(entity);
  }

  async update(id: string, data: Partial<Basket>): Promise<Basket> {
    await this.findOne(id); // Vérif existence
    await this.basketRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const basket = await this.findOne(id);
    await this.basketRepo.remove(basket);
  }
}
