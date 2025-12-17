import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupLocation } from './entities/pickup-location.entity';
import { CreatePickupDto } from './dto/create-pickup.dto';

@Injectable()
export class PickupService {
  constructor(
    @InjectRepository(PickupLocation)
    private readonly pickupRepo: Repository<PickupLocation>
  ) {}

  async findAll(actif?: boolean) {
    if (actif === undefined) {
      return this.pickupRepo.find({ order: { name_pickup: 'ASC' } });
    }
    return this.pickupRepo.find({
      where: { actif },
      order: { name_pickup: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PickupLocation> {
    const loc = await this.pickupRepo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException('Lieu non trouvé');
    return loc;
  }

  async create(dto: CreatePickupDto): Promise<PickupLocation> {
    const entity = this.pickupRepo.create(dto);
    return await this.pickupRepo.save(entity);
  }

  async update(id: string, dto: CreatePickupDto): Promise<PickupLocation> {
    const loc = await this.pickupRepo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException('Lieu non trouvé');

    const merged = this.pickupRepo.merge(loc, dto);
    return await this.pickupRepo.save(merged);
  }

  async remove(id: string): Promise<void> {
    const loc = await this.findOne(id);
    await this.pickupRepo.remove(loc);
  }
}
