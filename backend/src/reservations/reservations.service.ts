// src/reservations/reservations.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';
import { AdminReservationListDto } from './dto/admin-reservation-list.dto';
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

  private static readonly JOURS: ReadonlyArray<string> = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ] as const;

  private static getDow(dateYmd: string): number {
    // dateYmd = 'YYYY-MM-DD'
    return new Date(`${dateYmd}T00:00:00`).getDay(); // 0..6
  }

  private static assertTuesdayOrFriday(dow: number): void {
    if (!(dow === 2 || dow === 5)) {
      throw new BadRequestException('Date incompatible : retrait le mardi ou le vendredi.');
    }
  }

  private static assertLocationAllowsDow(loc: PickupLocation, dow: number): void {
    const locDays = (Array.isArray(loc.day_of_week) ? loc.day_of_week : null) ?? null;

    // Si le lieu ne définit pas de contrainte → pas de blocage
    if (!locDays || locDays.length === 0) return;

    if (!locDays.includes(dow)) {
      const lisible = locDays.map((n) => ReservationsService.JOURS[n] ?? `${n}`).join(' ou ');
      throw new BadRequestException(
        `Date incompatible avec le jour de retrait du lieu : ${lisible}.`
      );
    }
  }

  // findAll(): Promise<Reservation[]> {
  //   return this.reservationRepo.find({
  //     relations: ['user', 'basket', 'location'],
  //     order: { pickup_date: 'ASC' },
  //   });
  // }

  async findOne(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    return res;
  }

  /** crée la réservation pour le user connecté (prix calculé côté serveur) */
  async create(dto: CreateReservationDto, userId: string): Promise<Reservation> {
    const [basket, loc] = await Promise.all([
      this.basketRepo.findOne({ where: { id: dto.basket_id } }),
      this.pickupRepo.findOne({ where: { id: dto.location_id } }),
    ]);

    if (!basket) throw new BadRequestException('Panier introuvable');
    if (!loc) throw new BadRequestException('Lieu introuvable');

    const dow = ReservationsService.getDow(dto.pickup_date);

    // Règle globale + contrainte du lieu (tableau)
    ReservationsService.assertTuesdayOrFriday(dow);
    ReservationsService.assertLocationAllowsDow(loc, dow);

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

    const [basket, loc] = await Promise.all([
      this.basketRepo.findOne({ where: { id: dto.basket_id } }),
      this.pickupRepo.findOne({ where: { id: dto.location_id } }),
    ]);
    if (!basket || !loc) throw new BadRequestException('Données invalides');

    const dow = ReservationsService.getDow(dto.pickup_date);
    ReservationsService.assertTuesdayOrFriday(dow);
    ReservationsService.assertLocationAllowsDow(loc, dow);

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

  // async remove(id: string, userId: string): Promise<void> {
  //   const res = await this.reservationRepo.findOne({
  //     where: { id, user: { id: userId } },
  //   });
  //   if (!res) throw new NotFoundException('Réservation introuvable');
  //   await this.reservationRepo.remove(res);
  // }

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

  // findAllForAdmin(params?: {
  //   status?: 'active' | 'archived';
  //   from?: string; // 'YYYY-MM-DD'
  //   to?: string; // 'YYYY-MM-DD'
  //   limit?: number;
  //   offset?: number;
  // }): Promise<AdminReservationListDto[]> {
  //   const qb = this.reservationRepo
  //     .createQueryBuilder('r')
  //     .leftJoin('r.user', 'u')
  //     .leftJoin('r.basket', 'b')
  //     .select([
  //       'r.id AS id',
  //       "concat(u.firstname, ' ', u.lastname) AS client_name",
  //       'b.name_basket AS basket_name',
  //       "to_char(r.pickup_date, 'YYYY-MM-DD') AS pickup_date",
  //       'r.statut AS statut',
  //       'r.quantity AS quantity',
  //     ])
  //     .orderBy('r.pickup_date', 'DESC');

  //   if (params?.status) qb.andWhere('r.statut = :status', { status: params.status });
  //   if (params?.from) qb.andWhere('r.pickup_date >= :from', { from: params.from });
  //   if (params?.to) qb.andWhere('r.pickup_date <= :to', { to: params.to });
  //   if (params?.limit) qb.limit(params.limit);
  //   if (params?.offset) qb.offset(params.offset);

  //   return qb.getRawMany<AdminReservationListDto>();
  // }

  async findAdminList(): Promise<AdminReservationListDto[]> {
    return this.reservationRepo
      .createQueryBuilder('r')
      .leftJoin('r.user', 'u')
      .leftJoin('r.basket', 'b')
      .select([
        'r.id AS id',
        "concat(u.firstname,' ',u.lastname) AS client_name",
        'b.name_basket AS basket_name',
        "to_char(r.pickup_date,'YYYY-MM-DD') AS pickup_date",
        'r.statut AS statut',
        'r.quantity AS quantity',
      ])
      .orderBy('r.pickup_date', 'DESC')
      .getRawMany<AdminReservationListDto>();
  }

  // — suppression admin sans contrainte d’appartenance
  async removeAsAdmin(id: string): Promise<void> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    await this.reservationRepo.remove(res);
  }
}
