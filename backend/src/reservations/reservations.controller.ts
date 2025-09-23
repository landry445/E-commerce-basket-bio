// src/reservations/reservations.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  UseGuards,
  Req,
  Patch,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { AdminReservationListDto } from './dto/admin-reservation-list.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /* ─────────── lecture pour le client connecté ─────────── */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Req() req): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findByUser(req.user.id);
  }

  /* ─────────── création accessible au client ─────────── */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReservationDto, @Req() req) {
    return this.reservationsService.create(dto, req.user.id);
  }

  /* ─────────── opérations admin uniquement ─────────── */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAllForAdmin(
    @Query('status') status?: 'active' | 'archived',
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<AdminReservationListDto[]> {
    return this.reservationsService.findAllForAdmin({
      status,
      from,
      to,
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation> {
    return this.reservationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateReservationDto, @Req() req) {
    return this.reservationsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/non-venu')
  async markNonVenu(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('non_venu') nonVenu: boolean
  ): Promise<{ updated: boolean }> {
    await this.reservationsService.setNonVenu(id, nonVenu);
    return { updated: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  removeAsAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.removeAsAdmin(id);
  }
}
