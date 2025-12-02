import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { BasketsService } from './baskets.service';
import { BasketsController } from './baskets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Basket])],
  providers: [BasketsService],
  controllers: [BasketsController],
  exports: [BasketsService],
})
export class BasketsModule {}
