import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'email_verification_tokens' })
export class EmailVerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (u) => u.id, { onDelete: 'CASCADE', nullable: false })
  user!: User;

  @Column({ type: 'bytea', nullable: false, unique: true })
  token_hash!: Buffer;

  @Column({ type: 'timestamptz', nullable: false })
  @Index()
  expires_at!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
