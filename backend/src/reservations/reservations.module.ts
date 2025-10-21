import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';
import { ReservationsArchiver } from './reservations.archiver';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Basket, PickupLocation]),
    ScheduleModule.forRoot(),
    MailModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsArchiver, ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}