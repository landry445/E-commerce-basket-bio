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

  // Normalisation sécurisée: [0..6], unique, trié, null si vide/indéfini
  private sanitizeDays(input?: number[] | null): number[] | null {
    if (!input || input.length === 0) return null;
    const valid = Array.from(
      new Set(
        input
          .filter((v) => Number.isInteger(v))
          .map((v) => Number(v))
          .filter((v) => v >= 0 && v <= 6)
      )
    ).sort((a, b) => a - b);
    return valid.length ? valid : null;
  }

  findAll(): Promise<PickupLocation[]> {
    return this.pickupRepo.find({ order: { name_pickup: 'ASC' } });
  }

  async findOne(id: string): Promise<PickupLocation> {
    const loc = await this.pickupRepo.findOne({ where: { id } });
    if (!loc) throw new NotFoundException('Lieu non trouvé');
    return loc;
  }

  async create(dto: CreatePickupDto): Promise<PickupLocation> {
    const entity: Partial<PickupLocation> = {
      name_pickup: dto.name_pickup,
      address: dto.address ?? null,
      actif: dto.actif ?? true,
      day_of_week: this.sanitizeDays(dto.day_of_week),
    };
    return this.pickupRepo.save(entity);
  }

  async update(id: string, dto: CreatePickupDto): Promise<PickupLocation> {
    const loc = await this.findOne(id);
    const patch: Partial<PickupLocation> = {
      name_pickup: dto.name_pickup ?? loc.name_pickup,
      address: dto.address ?? loc.address,
      actif: dto.actif ?? loc.actif,
      day_of_week:
        dto.day_of_week !== undefined ? this.sanitizeDays(dto.day_of_week) : loc.day_of_week,
    };
    return this.pickupRepo.save({ ...loc, ...patch });
  }

  async remove(id: string): Promise<void> {
    const loc = await this.findOne(id);
    await this.pickupRepo.remove(loc);
  }
}
