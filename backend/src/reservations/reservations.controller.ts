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
  DefaultValuePipe,
  ParseIntPipe,
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
// import { CheckoutDto } from './dto/checkout.dto';

type ReqWithUser = { user: { id: string } };

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /* ─────────── lecture pour le client connecté ─────────── */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyReservations(@Req() req: ReqWithUser): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/compact')
  async mineCompact(
    @Req() req: ReqWithUser,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.reservationsService.findMineCompact(req.user.id, limit);
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
  @Get('admin-list')
  listAdmin(@Query('status') status?: 'active' | 'archived'): Promise<AdminReservationListDto[]> {
    // ← retour typé
    return this.reservationsService.findAdminList({ status });
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateReservationDto,
    @Req() req: ReqWithUser
  ) {
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

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  async createBulk(
    @Req() req: ReqWithUser,
    @Body()
    body: {
      location_id: string;
      pickup_date: string;
      items: { basket_id: string; quantity: number }[];
    }
  ) {
    return this.reservationsService.createBulk(body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('view/:id')
  async viewOneForOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: { user: { id: string } }
  ) {
    return this.reservationsService.findOneForView(id, req.user.id);
  }
}
