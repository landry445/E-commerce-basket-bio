import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Basket } from '../../baskets/entities/basket.entity';
import { PickupLocation } from '../../pickup/entities/pickup-location.entity';

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
  price_reservation: number;

  @Column({ type: 'date' })
  pickup_date: string;

  @Column({ type: 'smallint', default: 1 })
  quantity: number;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: ReservationStatut,
    default: ReservationStatut.ACTIVE,
  })
  statut: ReservationStatut;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz',
    nullable: true,
  })
  email_sent_at: Date | null;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz',
    nullable: true,
  })
  sms_sent_at: Date | null;

  @Column({ type: 'boolean', default: false })
  non_venu: boolean;

  @CreateDateColumn({
    name: 'date_creation',
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz',
  })
  date_creation: Date;

  @Column({ type: 'text', default: '' })
  customer_note!: string;

  @Index() // + index utile pour la page de confirmation
  @Column('uuid', { nullable: true }) // + nouvelle colonne
  group_id?: string;
}
