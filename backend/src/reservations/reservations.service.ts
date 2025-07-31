// src/reservations/reservations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.reservationRepo.find({
      relations: ['user', 'basket', 'location'],
      order: { pickup_date: 'ASC' }, // optionnel, mais utile pour affichage
    });
  }


  async findOne(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    return res;
  }

  /** crée la réservation pour le user connecté */
  create(dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const entity = this.reservationRepo.create({
      ...dto,
      user: { id: userId },
    });
    return this.reservationRepo.save(entity);
  }

  /** mise à jour seulement si la réservation appartient au user */
  async update(id: string, dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!res) throw new NotFoundException('Réservation introuvable');
    return this.reservationRepo.save({ ...res, ...dto });
  }

  async remove(id: string, userId: string): Promise<void> {
    const res = await this.reservationRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!res) throw new NotFoundException('Réservation introuvable');
    await this.reservationRepo.remove(res);
  }

  async findByUser(userId: string): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationRepo.find({
      where: { user: { id: userId } },
      order: { pickup_date: 'DESC' },
      relations: ['user', 'basket', 'location'],
    });

    return reservations.map((r) =>
      plainToInstance(
        ReservationResponseDto,
        {
          ...r,
          user_id: r.user?.id,
          basket_id: r.basket?.id,
          location_id: r.location?.id,
        },
        { excludeExtraneousValues: true },
      ),
    );
  }
}
