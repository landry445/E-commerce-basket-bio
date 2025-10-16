import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reservation, ReservationStatut } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';
import { AdminReservationListDto } from './dto/admin-reservation-list.dto';
import { ClientOrderCompactDto } from './dto/client-order-compact.dto';

type RawRow = {
  id: string;
  pickupdate: string; // alias en minuscules
  basketname: string | null;
  totalqty: string | null; // agrégat/nombre vus comme string
};
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
    if (!locDays || locDays.length === 0) return;
    if (!locDays.includes(dow)) {
      const lisible = locDays.map((n) => ReservationsService.JOURS[n] ?? `${n}`).join(' ou ');
      throw new BadRequestException(
        `Date incompatible avec le jour de retrait du lieu : ${lisible}.`
      );
    }
  }

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

  /** Liste admin à plat avec filtres (status, intervalle), pagination basique */
  async findAdminList(params?: {
    status?: 'active' | 'archived';
    from?: string; // 'YYYY-MM-DD'
    to?: string; // 'YYYY-MM-DD'
    limit?: number; // défaut 100
    offset?: number; // défaut 0
  }): Promise<AdminReservationListDto[]> {
    const qb = this.reservationRepo
      .createQueryBuilder('r')
      .leftJoin('r.user', 'u')
      .leftJoin('r.basket', 'b')
      .select([
        'r.id AS id',
        "concat(u.firstname, \' \', u.lastname) AS client_name",
        'b.name_basket AS basket_name',
        "to_char(r.pickup_date, 'YYYY-MM-DD') AS pickup_date",
        'r.statut AS statut',
        'r.quantity AS quantity',
      ])
      .orderBy('r.pickup_date', 'DESC');

    // Date du jour en Europe/Paris (référence unique pour le filtrage)
    const todayExpr = `(now() at time zone 'Europe/Paris')::date`;

    // Fenêtre de dates optionnelle
    if (params?.from) qb.andWhere('r.pickup_date >= :from', { from: params.from });
    if (params?.to) qb.andWhere('r.pickup_date <= :to', { to: params.to });

    // Séparation stricte + filet de sécurité:
    // - Actives: seulement aujourd'hui et futur, et statut 'active'
    // - Archives: statut 'archived' OU date passée (si le cron n'a pas encore tourné)
    if (params?.status === 'active') {
      qb.andWhere(`r.pickup_date >= ${todayExpr}`).andWhere(`r.statut = :s`, {
        s: ReservationStatut.ACTIVE,
      });
    } else if (params?.status === 'archived') {
      qb.andWhere(`(r.statut = :sArch OR r.pickup_date < ${todayExpr})`, {
        sArch: ReservationStatut.ARCHIVED,
      });
    }

    qb.limit(params?.limit ?? 100);
    qb.offset(params?.offset ?? 0);

    return qb.getRawMany<AdminReservationListDto>();
  }

  /** Archivage serveur des réservations dont la date est antérieure à aujourd’hui (Europe/Paris) */
  async archivePastReservations(): Promise<number> {
    const res = await this.reservationRepo
      .createQueryBuilder()
      .update(Reservation)
      .set({ statut: ReservationStatut.ARCHIVED })
      .where(`pickup_date < (now() at time zone 'Europe/Paris')::date`)
      .andWhere(`statut != :archived`, { archived: ReservationStatut.ARCHIVED })
      .execute();

    return res.affected ?? 0;
  }

  // — suppression admin sans contrainte d’appartenance
  async removeAsAdmin(id: string): Promise<void> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    await this.reservationRepo.remove(res);
  }

  /** Mes réservations (côté client) */
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

  async findMineCompact(userId: string, limit: number) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 5, 50));

    const rows = await this.reservationRepo
      .createQueryBuilder('r')
      // si ta relation s’appelle bien "basket" dans l’entité Reservation :
      .innerJoin('r.basket', 'b')
      .where('r.user_id = :userId', { userId })
      .select('r.id', 'id')
      // alias en minuscules (évite les surprises côté driver)
      .addSelect("to_char(r.pickup_date, 'YYYY-MM-DD')", 'pickupdate')
      .addSelect("COALESCE(b.name_basket, '')", 'basketname')
      .addSelect('COALESCE(r.quantity, 0)', 'totalqty')
      .orderBy('r.pickup_date', 'DESC')
      .limit(safeLimit)
      .getRawMany<RawRow>();

    return rows.map((r) => ({
      id: r.id,
      pickupDate: r.pickupdate, // correspond à l’alias 'pickupdate'
      basketName: r.basketname ?? '',
      totalQty: Number(r.totalqty ?? '0') || 0,
    }));
  }
}

