import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity({ name: 'baskets' })
export class Basket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name_basket: string;

  @Column()
  price_basket: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_basket: string;

  @Column({ type: 'bytea', nullable: true }) // <= nouvelle colonne
  image_data: Buffer;

  @Column({ nullable: true }) // <= type MIME de l'image
  image_mime: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;

  @OneToMany(() => Reservation, (r: Reservation) => r.basket)
  reservations: Reservation[];
}
