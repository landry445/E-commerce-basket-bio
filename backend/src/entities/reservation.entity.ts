import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user.entity';
import { Basket } from './basket.entity';
import { PickupLocation } from './pickup-location.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Basket, (basket) => basket.reservations)
  basket: Basket;

  @ManyToOne(() => PickupLocation, (location) => location.reservations)
  pickupLocation: PickupLocation;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
