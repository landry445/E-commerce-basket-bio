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
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { ReservationResponseDto } from './dto/reservation-response.dto';
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
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
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
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.reservationsService.remove(id, req.user.id);
  }
}
