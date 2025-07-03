import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PickupService } from './pickup.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { PickupLocation } from './entities/pickup-location.entity';

@Controller('pickup')
export class PickupController {
  constructor(private readonly pickupService: PickupService) {}

  @Get()
  findAll(): Promise<PickupLocation[]> {
    return this.pickupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PickupLocation> {
    return this.pickupService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePickupDto): Promise<PickupLocation> {
    return this.pickupService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreatePickupDto): Promise<PickupLocation> {
    return this.pickupService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.pickupService.remove(id);
  }
}
