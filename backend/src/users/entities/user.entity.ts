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

  @Column()
  password_hash: string;

  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  date_creation: Date;

  @OneToMany(() => Reservation, (r: Reservation) => r.user, { cascade: true })
  reservations: Reservation[];

  @Column({ type: 'timestamptz', nullable: true })
  email_verified_at!: Date | null;

  @Column({
    name: 'newsletter_opt_in',
    type: 'boolean',
    default: false,
  })
  newsletterOptIn!: boolean;

  @Column({
    name: 'newsletter_opt_in_updated_at',
    type: 'timestamptz',
    nullable: true,
  })
  newsletterOptInUpdatedAt!: Date | null;
}
