// src/reservations/reservations.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
    @InjectRepository(PickupLocation)
    private readonly pickupRepo: Repository<PickupLocation>
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.reservationRepo.find({
      relations: ['user', 'basket', 'location'],
      order: { pickup_date: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    return res;
  }

  /** crée la réservation pour le user connecté (prix calculé côté serveur) */
  async create(dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const basket = await this.basketRepo.findOne({ where: { id: dto.basket_id } });
    if (!basket) throw new BadRequestException('Panier introuvable');

    const loc = await this.pickupRepo.findOne({ where: { id: dto.location_id } });
    if (!loc) throw new BadRequestException('Lieu introuvable');

    // cohérence jour/lieu (évite le trigger SQL)
    const dow = new Date(dto.pickup_date + 'T00:00:00').getDay(); // 0..6
    if (dow !== loc.day_of_week) {
      throw new BadRequestException('Date incompatible avec le jour de retrait du lieu');
    }

    const price = basket.price_basket * dto.quantity;

    const entity = this.reservationRepo.create({
      user: { id: userId },
      basket: { id: dto.basket_id },
      location: { id: dto.location_id },
      pickup_date: dto.pickup_date,
      quantity: dto.quantity,
      price_reservation: price,
    });

    return this.reservationRepo.save(entity);
  }

  /** mise à jour (recalcule aussi le prix) */
  async update(id: string, dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!res) throw new NotFoundException('Réservation introuvable');

    const basket = await this.basketRepo.findOne({ where: { id: dto.basket_id } });
    const loc = await this.pickupRepo.findOne({ where: { id: dto.location_id } });
    if (!basket || !loc) throw new BadRequestException('Données invalides');

    const dow = new Date(dto.pickup_date + 'T00:00:00').getDay();
    if (dow !== loc.day_of_week) {
      throw new BadRequestException('Date incompatible avec le jour de retrait du lieu');
    }

    const price = basket.price_basket * dto.quantity;

    return this.reservationRepo.save({
      ...res,
      basket: { id: dto.basket_id },
      location: { id: dto.location_id },
      pickup_date: dto.pickup_date,
      quantity: dto.quantity,
      price_reservation: price,
    });
  }

  async setNonVenu(id: string, nonVenu: boolean): Promise<void> {
    const reservation = await this.reservationRepo.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Réservation non trouvée');
    reservation.non_venu = nonVenu;
    await this.reservationRepo.save(reservation);
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
        { excludeExtraneousValues: true }
      )
    );
  }
}
