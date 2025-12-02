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
import { PickupService } from './pickup.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { PickupLocation } from './entities/pickup-location.entity';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

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

  // ---- Les routes suivantes sont réservées à l'admin ----
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() dto: CreatePickupDto): Promise<PickupLocation> {
    return this.pickupService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePickupDto,
  ): Promise<PickupLocation> {
    return this.pickupService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.pickupService.remove(id);
  }
}
