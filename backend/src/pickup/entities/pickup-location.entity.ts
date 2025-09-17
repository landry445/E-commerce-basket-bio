import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity({ name: 'pickup_locations' })
export class PickupLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_pickup: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'smallint', array: true, nullable: true })
  day_of_week: number[] | null;

  @Column({ default: true })
  actif: boolean;

  @OneToMany(() => Reservation, (r: Reservation) => r.location)
  reservations: Reservation[];
}
