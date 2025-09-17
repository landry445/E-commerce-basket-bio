import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PickupLocation } from '../../pickup/entities/pickup-location.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // ← important
  user!: User;

  @ManyToOne(() => PickupLocation, { nullable: true })
  @JoinColumn({ name: 'location_id' }) // ← important
  location?: PickupLocation | null;

  @Column({ name: 'pickup_date', type: 'date' })
  pickupDate!: string; // YYYY-MM-DD

  @Column({ name: 'total_price', type: 'int' })
  totalPrice!: number; // cents

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ACTIVE })
  statut!: OrderStatus;

  @CreateDateColumn({ name: 'date_creation', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true })
  items!: OrderItem[];
}
