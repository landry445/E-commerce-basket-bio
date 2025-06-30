import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BasketsModule } from './baskets/baskets.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PickupModule } from './pickup/pickup.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // à mettre à true uniquement pour du dev local !
    }),
    UsersModule,
    BasketsModule,
    ReservationsModule,
    PickupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
