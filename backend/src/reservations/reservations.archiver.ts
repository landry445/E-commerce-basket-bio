// src/reservations/reservations.archiver.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatut } from './entities/reservation.entity';

@Injectable()
export class ReservationsArchiver {
  private readonly logger = new Logger(ReservationsArchiver.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly repo: Repository<Reservation>
  ) {}

  // Tous les jours à 00:10 Europe/Paris
  @Cron('10 0 * * *', { timeZone: 'Europe/Paris' })
  async archivePastReservations(): Promise<void> {
    // Utilisation CURRENT_DATE côté SQL = date locale DB ; forçage TZ Paris
    await this.repo
      .createQueryBuilder()
      .update(Reservation)
      .set({ statut: ReservationStatut.ARCHIVED })
      .where(`pickup_date < (now() at time zone 'Europe/Paris')::date`)
      .andWhere(`statut != :arch`, { arch: ReservationStatut.ARCHIVED })
      .execute();

    this.logger.log('Archivage des réservations passées effectué.');
  }
}
