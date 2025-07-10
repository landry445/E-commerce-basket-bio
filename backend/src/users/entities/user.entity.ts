import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  password_hash: string;

  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;

  @OneToMany(() => Reservation, (r: Reservation) => r.user, { cascade: true })
  reservations: Reservation[];
}
