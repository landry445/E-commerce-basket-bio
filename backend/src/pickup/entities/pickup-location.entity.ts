import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity({ name: 'pickup_locations' })
export class PickupLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ type: 'smallint' })
  day_of_week: number;

  @Column({ default: true })
  actif: boolean;

  @OneToMany(() => Reservation, (r: Reservation) => r.location)
  reservations: Reservation[];
}
