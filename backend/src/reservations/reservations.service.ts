// src/reservations/reservations.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateReservationBatchDto } from './dto/create-reservation-batch.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
    @InjectRepository(PickupLocation)
    private readonly pickupRepo: Repository<PickupLocation>
  ) {}

  /* ------------------------ helpers ------------------------ */

  private getDow(dateISO: string): number {
    // 0..6 en UTC, aligné avec Postgres EXTRACT(DOW)
    return new Date(`${dateISO}T00:00:00Z`).getUTCDay();
  }

  private assertPickupDayAllowed(pickupDateISO: string, loc: PickupLocation): void {
    const days = loc.day_of_week; // number[] | null
    if (!Array.isArray(days) || days.length === 0) return; // aucun contrôle si NULL/vides
    const dow = this.getDow(pickupDateISO);
    if (!days.includes(dow)) {
      throw new BadRequestException('Date incompatible avec les jours de retrait du lieu');
    }
  }

  /* ------------------------ queries ------------------------ */

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

  /* ------------------------ create/update/delete ------------------------ */

  /** création simple (1 panier) */
  async create(dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const basket = await this.basketRepo.findOne({
      where: { id: dto.basket_id },
    });
    if (!basket) throw new BadRequestException('Panier introuvable');

    const loc = await this.pickupRepo.findOne({
      where: { id: dto.location_id },
    });
    if (!loc) throw new BadRequestException('Lieu introuvable');

    this.assertPickupDayAllowed(dto.pickup_date, loc);

    const price = basket.price_basket * dto.quantity;

    // group_id null autorisé : le trigger SQL peut en générer un si besoin
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

  /** création groupée (N paniers → même group_id) */
  async createBatch(
    dto: CreateReservationBatchDto,
    userId: string
  ): Promise<{ group_id: string; total_price: number; items: Reservation[] }> {
    if (!dto.items?.length) throw new BadRequestException('Aucun panier sélectionné');

    const loc = await this.pickupRepo.findOne({
      where: { id: dto.location_id },
    });
    if (!loc) throw new BadRequestException('Lieu introuvable');

    this.assertPickupDayAllowed(dto.pickup_date, loc);

    const basketIds = dto.items.map((i) => i.basket_id);
    const baskets = await this.basketRepo.find({
      where: { id: In(basketIds) },
    });
    if (baskets.length !== basketIds.length) throw new BadRequestException('Panier introuvable');

    const groupId = randomUUID(); // même group_id pour toutes les lignes

    const rows = dto.items.map((it) => {
      const b = baskets.find((x) => x.id === it.basket_id)!;
      const price = b.price_basket * it.quantity;
      return this.reservationRepo.create({
        user: { id: userId },
        basket: { id: it.basket_id },
        location: { id: dto.location_id },
        pickup_date: dto.pickup_date,
        quantity: it.quantity,
        price_reservation: price,
        group_id: groupId,
      });
    });

    return this.ds.transaction(async (tx) => {
      const saved = await tx.getRepository(Reservation).save(rows);
      const total = saved.reduce((s, r) => s + r.price_reservation, 0);
      return { group_id: groupId, total_price: total, items: saved };
    });
  }

  /** mise à jour (recalcule le prix) */
  async update(id: string, dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!res) throw new NotFoundException('Réservation introuvable');

    const basket = await this.basketRepo.findOne({
      where: { id: dto.basket_id },
    });
    if (!basket) throw new BadRequestException('Panier introuvable');

    const loc = await this.pickupRepo.findOne({
      where: { id: dto.location_id },
    });
    if (!loc) throw new BadRequestException('Lieu introuvable');

    this.assertPickupDayAllowed(dto.pickup_date, loc);

    const price = basket.price_basket * dto.quantity;

    return this.reservationRepo.save({
      ...res,
      basket: { id: dto.basket_id },
      location: { id: dto.location_id },
      pickup_date: dto.pickup_date,
      quantity: dto.quantity,
      price_reservation: price,
      // group_id conservé depuis res.group_id
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
}
