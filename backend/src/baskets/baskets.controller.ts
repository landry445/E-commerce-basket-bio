import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { BasketsService } from './baskets.service';
import { Basket } from './entities/basket.entity';

@Controller('baskets')
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}

  @Get()
  findAll(): Promise<Basket[]> {
    return this.basketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Basket> {
    return this.basketsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBasketDto): Promise<Basket> {
    return this.basketsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateBasketDto): Promise<Basket> {
    return this.basketsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.basketsService.remove(id);
  }
}
