import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Basket } from '../baskets/entities/basket.entity';
import { User } from '../users/entities/user.entity';
import { PickupLocation } from '../pickup/entities/pickup-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Basket, User, PickupLocation])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
