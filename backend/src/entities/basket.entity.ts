import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class Basket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column({ type: 'date' })
  availableDate: string;

  @OneToMany(() => Reservation, (reservation) => reservation.basket)
  reservations: Reservation[];
}
