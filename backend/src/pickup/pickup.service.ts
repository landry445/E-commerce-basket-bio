import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupLocation } from './entities/pickup-location.entity';
import { CreatePickupDto } from './dto/create-pickup.dto';

@Injectable()
export class PickupService {
  constructor(
    @InjectRepository(PickupLocation)
    private readonly pickupRepo: Repository<PickupLocation>,
  ) {}

  findAll(): Promise<PickupLocation[]> {
    return this.pickupRepo.find();
  }

  async findOne(id: string): Promise<PickupLocation> {
    const loc = await this.pickupRepo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException('Lieu non trouvé');
    return loc;
  }

  create(dto: CreatePickupDto): Promise<PickupLocation> {
    return this.pickupRepo.save(dto);
  }

  async update(id: string, dto: CreatePickupDto): Promise<PickupLocation> {
    const loc = await this.findOne(id);
    return this.pickupRepo.save({ ...loc, ...dto });
  }

  async remove(id: string): Promise<void> {
    const loc = await this.findOne(id);
    await this.pickupRepo.remove(loc);
  }
}
