import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reservation> {
    return this.reservationsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.reservationsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMyReservations(@Req() req): Promise<ReservationResponseDto[]> {
    // Affiche toutes les réservations du user connecté
    return this.reservationsService.findByUser(req.user.id);
  }
}
