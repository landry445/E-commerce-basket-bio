import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BasketsModule } from './baskets/baskets.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PickupModule } from './pickup/pickup.module';
import { User } from './users/entities/user.entity';
import { Basket } from './baskets/entities/basket.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { PickupLocation } from './pickup/entities/pickup-location.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        if (process.env.NODE_ENV === 'test') {
          return {
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            synchronize: true,
            entities: [User, Basket, Reservation, PickupLocation],
          };
        }

        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: true, // ✅ À désactiver pour la production
        };
      },
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
