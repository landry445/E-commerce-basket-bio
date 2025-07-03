import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Basket } from './entities/basket.entity';
import { CreateBasketDto } from './dto/create-basket.dto';

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

  create(dto: CreateBasketDto): Promise<Basket> {
    return this.basketRepo.save(dto);
  }

  async update(id: string, dto: CreateBasketDto): Promise<Basket> {
    const basket = await this.findOne(id);
    return this.basketRepo.save({ ...basket, ...dto });
  }

  async remove(id: string): Promise<void> {
    const basket = await this.findOne(id);
    await this.basketRepo.remove(basket);
  }
}
