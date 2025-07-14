// src/reservations/reservations.controller.ts
import {
  Controller, Get, Post, Body, Param, Delete, Put,
  ParseUUIDPipe, UseGuards, Req
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /* ─────────── lecture publique ─────────── */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Req() req): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findByUser(req.user.id);
  }

  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation> {
    return this.reservationsService.findOne(id);
  }

  /* ─────────── opérations protégées ─────────── */

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReservationDto, @Req() req) {
    return this.reservationsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateReservationDto,
    @Req() req
  ) {
    return this.reservationsService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.reservationsService.remove(id, req.user.id);
  }

}
