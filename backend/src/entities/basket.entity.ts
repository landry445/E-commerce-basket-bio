import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity({ name: 'baskets' })
export class Basket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prix_centimes: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;

  @OneToMany(() => Reservation, (r: Reservation) => r.basket)
  reservations: Reservation[];
}
