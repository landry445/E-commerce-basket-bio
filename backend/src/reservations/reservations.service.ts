import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.reservationRepo.find();
  }

  async findOne(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    return res;
  }

  create(dto: CreateReservationDto): Promise<Reservation> {
    return this.reservationRepo.save(dto);
  }

  async update(id: string, dto: CreateReservationDto): Promise<Reservation> {
    const res = await this.findOne(id);
    return this.reservationRepo.save({ ...res, ...dto });
  }

  async remove(id: string): Promise<void> {
    const res = await this.findOne(id);
    await this.reservationRepo.remove(res);
  }
}
