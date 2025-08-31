import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Basket } from '../baskets/entities/basket.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Basket, PickupLocation])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}