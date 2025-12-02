import { addHours } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { User } from '../users/entities/user.entity';
import { MailerService } from '../mail/mailer.service';

type SignupMailParams = {
  user: Pick<User, 'id' | 'email' | 'firstname'>; // using correct property name
};

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly tokenRepo: Repository<EmailVerificationToken>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailer: MailerService,
  ) {}

  private hash(raw: string): Buffer {
    return createHash('sha256').update(raw, 'utf8').digest();
  }

  async sendSignupConfirmationMail(params: SignupMailParams): Promise<void> {
    const raw = randomBytes(32).toString('hex'); // token brut (non stocké)
    const token = this.tokenRepo.create({
      user: { id: params.user.id } as User,
      token_hash: this.hash(raw),
      expires_at: addHours(new Date(), 24), // validité 24h
    });
    await this.tokenRepo.save(token);

    const verifyUrlBase =
      process.env.EMAIL_VERIFY_URL_BASE ?? 'http://localhost:3001/auth/verify-email';
    const verifyUrl = `${verifyUrlBase}?token=${raw}`;

    const html = this.mailer.signupConfirmationHTML({
      firstname: params.user.firstname ?? '',
      verifyUrl,
      expiresHours: 24,
    });

    await this.mailer.send({
      to: params.user.email,
      subject: 'Confirme ton adresse e-mail',
      html,
      text: `Confirme ton adresse e-mail: ${verifyUrl}`,
    });
  }

  async verifyToken(rawToken: string): Promise<void> {
    const tokenHash = this.hash(rawToken);
    const record = await this.tokenRepo.findOne({
      where: { token_hash: tokenHash },
      relations: ['user'],
    });

    if (!record) throw new NotFoundException('Lien invalide.');
    if (record.expires_at.getTime() < Date.now()) {
      await this.tokenRepo.delete({ id: record.id });
      throw new BadRequestException('Lien expiré.');
    }

    await this.userRepo.update({ id: record.user.id }, { email_verified_at: new Date() });
    await this.tokenRepo.delete({ id: record.id });
  }
}
