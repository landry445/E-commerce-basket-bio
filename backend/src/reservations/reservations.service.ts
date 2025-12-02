import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DateTime } from 'luxon';

import { Reservation, ReservationStatut } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { plainToInstance } from 'class-transformer';

import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';
import { AdminReservationListDto } from './dto/admin-reservation-list.dto';
import { MailerService } from '../mail/mailer.service';
import { isBookingWindowOpen, PickupKind } from './utils/booking-window';

import type { ConfirmReservationDto } from './dto/confirm-reservation.dto';

type RawRow = {
  id: string;
  pickupdate: string; // alias en minuscules
  basketname: string | null;
  totalqty: string | null; // agrégat/nombre vus comme string
  customer_note: string | null;
};

type BulkItem = { basket_id: string; quantity: number };
type BulkPayload = {
  location_id: string;
  pickup_date: string;
  items: BulkItem[];
  customer_note?: string;
};

@Injectable()
export class ReservationsService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Basket)
    private readonly basketRepo: Repository<Basket>,
    @InjectRepository(PickupLocation)
    private readonly pickupRepo: Repository<PickupLocation>,
    private readonly mailer: MailerService,
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
        `Date incompatible avec le jour de retrait du lieu : ${lisible}.`,
      );
    }
  }

  private assertWindowOpen(pickupDate: Date): void {
    const zone = 'Europe/Paris';
    const dt = DateTime.fromJSDate(pickupDate, { zone }).startOf('day');

    const kind: PickupKind =
      dt.weekday === 2
        ? 'tuesday'
        : dt.weekday === 5
          ? 'friday'
          : (() => {
              throw new ForbiddenException('Jour de retrait invalide');
            })();

    const ok = isBookingWindowOpen(kind, { pickupDateISO: dt.toISO() ?? '' });
    if (!ok) {
      throw new ForbiddenException('Réservations fermées pour ce créneau');
    }
  }

  async findOne(id: string): Promise<Reservation> {
    const res = await this.reservationRepo.findOne({ where: { id } });
    if (!res) throw new NotFoundException('Réservation non trouvée');
    return res;
  }

  /** crée UNE réservation pour UN panier (compat héritée) + e-mail individuel */
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
    this.assertWindowOpen(new Date(dto.pickup_date + 'T00:00:00'));

    const price = basket.price_basket * dto.quantity;

    const entity = this.reservationRepo.create({
      user: { id: userId },
      basket: { id: dto.basket_id },
      location: { id: dto.location_id },
      pickup_date: dto.pickup_date,
      quantity: dto.quantity,
      price_reservation: price,
      customer_note: dto.customer_note ?? '',
    });

    const saved = await this.reservationRepo.save(entity);

    // ---- e-mail individuel (garde rétrocompat si l’UI poste encore au /reservations) ----
    try {
      const withRels = await this.reservationRepo.findOne({
        where: { id: saved.id },
        relations: ['user', 'basket', 'location'],
      });

      if (withRels?.user?.email) {
        const unitPriceCents = Math.round((withRels.basket?.price_basket ?? 0) * 100);
        const qty = withRels.quantity ?? 1;

        const html = this.mailer.orderConfirmationHTML({
          firstname: withRels.user.firstname ?? '',
          pickupDateISO: new Date(withRels.pickup_date).toISOString().slice(0, 10),
          pickupName: withRels.location?.name_pickup ?? '',
          items: [
            {
              name: withRels.basket?.name_basket ?? 'Panier',
              quantity: qty,
              unitPriceCents,
            },
          ],
          totalCents: unitPriceCents * qty,
          customerNote: (withRels.customer_note ?? '').trim(),
        });

        await this.mailer.send({
          to: withRels.user.email,
          subject: 'Confirmation de réservation',
          html,
          text: 'Confirmation de réservation',
        });

        await this.reservationRepo.update({ id: saved.id }, { email_sent_at: new Date() });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('MAIL_SEND_ERROR', e);
    }

    return saved;
  }

  /**
   * crée PLUSIEURS réservations en une fois (un enregistrement par panier)
   * puis envoie UN SEUL e-mail récapitulatif ("bon de commande").
   */
  async createBulk(payload: BulkPayload, userId: string): Promise<{ groupId: string }> {
    if (!payload.items || payload.items.length === 0) {
      throw new BadRequestException('Aucun panier sélectionné.');
    }

    const groupId = randomUUID();

    const loc = await this.pickupRepo.findOne({ where: { id: payload.location_id } });
    if (!loc) throw new BadRequestException('Lieu introuvable');

    const dow = ReservationsService.getDow(payload.pickup_date);
    ReservationsService.assertTuesdayOrFriday(dow);
    ReservationsService.assertLocationAllowsDow(loc, dow);

    // charge tous les paniers nécessaires
    const basketIds = Array.from(new Set(payload.items.map((i) => i.basket_id)));
    const baskets = await this.basketRepo
      .createQueryBuilder('b')
      .where('b.id IN (:...ids)', { ids: basketIds })
      .getMany();

    const map = new Map(baskets.map((b) => [b.id, b]));
    // vérifications
    for (const it of payload.items) {
      if (!map.get(it.basket_id)) {
        throw new BadRequestException('Panier introuvable');
      }
      if (!Number.isInteger(it.quantity) || it.quantity < 1) {
        throw new BadRequestException('Quantité invalide');
      }
    }

    // transaction
    const qr = this.ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    const note: string = (payload.customer_note ?? '').trim();

    const createdIds: string[] = [];
    try {
      for (const it of payload.items) {
        const b = map.get(it.basket_id)!;
        const unitPriceCents = Math.round(Number(b.price_basket) * 100);
        const priceCents = unitPriceCents * it.quantity;

        const entity = this.reservationRepo.create({
          user: { id: userId },
          basket: { id: it.basket_id },
          location: { id: payload.location_id },
          pickup_date: payload.pickup_date,
          quantity: Math.trunc(Number(it.quantity)),
          price_reservation: priceCents,
          customer_note: note,
          group_id: groupId,
        });

        const saved = await qr.manager.save(Reservation, entity);
        createdIds.push(saved.id);
      }

      await qr.commitTransaction();
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }

    // e-mail unique récapitulatif
    try {
      const userRow = await this.reservationRepo.query(
        `SELECT 
      email, 
      CONCAT_WS(' ', firstname, lastname) AS full_name
    FROM users 
    WHERE id = $1 
    LIMIT 1`,
        [userId],
      );

      const to: string | undefined = userRow?.[0]?.email;
      const displayName: string =
        (userRow?.[0]?.full_name as string | undefined)?.trim() || 'client';
      if (to) {
        const lines = payload.items.map((it) => {
          const b = map.get(it.basket_id)!;
          return {
            name: b.name_basket,
            quantity: it.quantity,
            unitPriceCents: Math.round(b.price_basket * 100),
          };
        });

        const totalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);

        const html = this.mailer.orderConfirmationHTML({
          firstname: displayName,
          pickupDateISO: new Date(payload.pickup_date).toISOString().slice(0, 10),
          pickupName: loc.name_pickup,
          items: lines,
          totalCents,
          customerNote: note,
        });

        await this.mailer.send({
          to,
          subject: 'Confirmation de réservation',
          html,
          text: 'Confirmation de réservation',
        });

        // marquer la date d’envoi sur toutes les réservations créées
        await this.reservationRepo
          .createQueryBuilder()
          .update(Reservation)
          .set({ email_sent_at: () => 'now()' })
          .where('id IN (:...ids)', { ids: createdIds })
          .execute();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('MAIL_SEND_ERROR', e);
    }

    return { groupId };
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
    this.assertWindowOpen(new Date(dto.pickup_date + 'T00:00:00'));

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
        "COALESCE(r.customer_note, '') AS customer_note",
      ])
      .orderBy('r.pickup_date', 'DESC');

    const todayExpr = `(now() at time zone 'Europe/Paris')::date`;

    if (params?.from) qb.andWhere('r.pickup_date >= :from', { from: params.from });
    if (params?.to) qb.andWhere('r.pickup_date <= :to', { to: params.to });

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

    const rows = await qb.getRawMany();
    return rows.map((r) =>
      plainToInstance(AdminReservationListDto, r, { excludeExtraneousValues: true }),
    );
  }

  /** Archivage serveur des réservations antérieures à aujourd’hui (Europe/Paris) */
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
        { excludeExtraneousValues: true },
      ),
    );
  }

  async findMineCompact(userId: string, limit: number) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 5, 50));

    const rows = await this.reservationRepo
      .createQueryBuilder('r')
      .innerJoin('r.basket', 'b')
      .where('r.user_id = :userId', { userId })
      .select('r.id', 'id')
      .addSelect("to_char(r.pickup_date, 'YYYY-MM-DD')", 'pickupdate')
      .addSelect("COALESCE(b.name_basket, '')", 'basketname')
      .addSelect('COALESCE(r.quantity, 0)', 'totalqty')
      .orderBy('r.pickup_date', 'DESC')
      .limit(safeLimit)
      .getRawMany<RawRow>();

    return rows.map((r) => ({
      id: r.id,
      pickupDate: r.pickupdate,
      basketName: r.basketname ?? '',
      totalQty: Number(r.totalqty ?? '0') || 0,
    }));
  }

  async findOneForView(id: string, ownerId: string) {
    const r = await this.reservationRepo.findOne({
      where: { id },
      relations: ['user', 'basket', 'location'],
    });
    if (!r) throw new NotFoundException('Réservation non trouvée');
    if (r.user?.id !== ownerId) throw new BadRequestException('Accès refusé');

    const item = {
      name: r.basket?.name_basket ?? 'Panier',
      qty: r.quantity ?? 1,
      price: Number(r.basket?.price_basket ?? 0),
    };
    return {
      id: r.id,
      pickup_label: `${new Date(r.pickup_date ?? '')?.toISOString().slice(0, 10)} • ${r.location?.name_pickup ?? ''}`,
      items: [item],
      total: item.price * item.qty,
    };
  }

  // + ajouter dans la classe ReservationsService
  async getSummaryByGroupId(groupId: string): Promise<ConfirmReservationDto> {
    // récupère toutes les lignes du groupe avec libellés et prix unitaires
    const rows = await this.ds.query(
      `
    SELECT
      r.pickup_date                                   AS pickup_date,
      pl.name_pickup                                  AS pickup_location_name,
      b.id                                            AS basket_id,
      b.name_basket                                   AS basket_name,
      (b.price_basket * 100)::int                     AS unit_price_cents,
      r.quantity                                      AS quantity,
      ((b.price_basket * 100)::int * r.quantity)      AS subtotal_cents
    FROM reservations r
    JOIN baskets b           ON b.id = r.basket_id
    JOIN pickup_locations pl ON pl.id = r.location_id
    WHERE r.group_id = $1
    ORDER BY b.name_basket ASC
    `,
      [groupId],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException('Réservation introuvable');
    }

    const totalCents = rows.reduce((s: number, r: any) => s + Number(r.subtotal_cents || 0), 0);

    return {
      groupId,
      pickupDateISO: new Date(rows[0].pickup_date).toISOString(),
      pickupLocationName: rows[0].pickup_location_name,
      totalCents,
      items: rows.map((r: any) => ({
        basketId: r.basket_id,
        basketName: r.basket_name,
        unitPriceCents: Number(r.unit_price_cents),
        quantity: Number(r.quantity),
        subtotalCents: Number(r.subtotal_cents),
      })),
    };
  }
}
