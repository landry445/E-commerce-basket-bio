import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Basket } from '../../baskets/entities/basket.entity';
import { PickupLocation } from '../../pickup/entities/pickup-location.entity';

export enum ReservationStatut {
  Active = 'active',
  Archived = 'archived',
}

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /* FK user_id + relation */
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /* FK basket_id + relation */
  @ManyToOne(() => Basket, { eager: false })
  @JoinColumn({ name: 'basket_id' })
  basket!: Basket;

  /* FK location_id + relation nullable */
  @ManyToOne(() => PickupLocation, { eager: false, nullable: true })
  @JoinColumn({ name: 'location_id' })
  location!: PickupLocation | null;

  @Column({ type: 'int' })
  price_reservation!: number;

  // 'YYYY-MM-DD'
  @Column({ type: 'date' })
  pickup_date!: string;

  @Column({ type: 'smallint', default: 1 })
  quantity!: number;

  // aligne l’ENUM TypeORM avec l’ENUM Postgres reservation_statut
  @Column({
    type: 'enum',
    enum: ReservationStatut,
    enumName: 'reservation_statut',
    default: ReservationStatut.Active,
  })
  statut!: ReservationStatut;

  // ← nouveau champ pour regrouper plusieurs lignes d'une même réservation logique
  @Column({ type: 'uuid', nullable: true })
  group_id!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  email_sent_at!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  sms_sent_at!: Date | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  date_creation!: Date;

  // si déjà utilisé dans ton service
  @Column({ type: 'boolean', default: false })
  non_venu!: boolean;
}
