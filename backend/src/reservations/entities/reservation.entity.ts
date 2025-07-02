import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Basket } from '../../baskets/entities/basket.entity';
import { PickupLocation } from './pickup-location.entity';

export enum ReservationStatut {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Basket, (basket) => basket.reservations)
  @JoinColumn({ name: 'basket_id' })
  basket: Basket;

  @ManyToOne(() => PickupLocation, (loc) => loc.reservations)
  @JoinColumn({ name: 'location_id' })
  location: PickupLocation;

  @Column()
  prix_centimes: number;

  @Column({ type: 'date' })
  pickup_date: string;

  @Column({ type: 'smallint', default: 1 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ReservationStatut,
    default: ReservationStatut.ACTIVE,
  })
  statut: ReservationStatut;

  @Column({ type: 'timestamptz', nullable: true })
  email_sent_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sms_sent_at: Date;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;
}
