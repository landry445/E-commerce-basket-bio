import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { BasketsService } from './baskets.service';
import { Basket } from './entities/basket.entity';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('baskets')
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}

  // Public - tout le monde peut voir les paniers
  @Get()
  findAll(): Promise<Basket[]> {
    return this.basketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Basket> {
    return this.basketsService.findOne(id);
  }

  // ---- Les routes suivantes sont réservées à l'admin ----
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreateBasketDto): Promise<Basket> {
    return this.basketsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateBasketDto): Promise<Basket> {
    return this.basketsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.basketsService.remove(id);
  }
}
