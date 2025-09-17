import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

type ReqUser = { user: { id: string } };

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  async create(@Req() req: ReqUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(req.user.id, dto);
  }
}
