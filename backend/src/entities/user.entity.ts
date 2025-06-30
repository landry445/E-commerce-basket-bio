import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  telephone: string;

  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;

  @OneToMany(() => Reservation, (r: Reservation) => r.user, { cascade: true })
  reservations: Reservation[];
}
