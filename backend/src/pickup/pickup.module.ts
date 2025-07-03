import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickupService } from './pickup.service';
import { PickupController } from './pickup.controller';
import { PickupLocation } from './entities/pickup-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PickupLocation])],
  providers: [PickupService],
  controllers: [PickupController],
  exports: [PickupService],
})
export class PickupModule {}
