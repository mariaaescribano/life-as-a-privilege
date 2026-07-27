import { Body, Controller, Get, Post, HttpCode, HttpStatus, ConflictException, BadRequestException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BookingService } from './booking.service';
import { LIMITE_RESERVA } from '../rate-limit';

export class BookingDto {
  nombre: string;
  email: string;
  fecha: string;   // YYYY-MM-DD
  slot: string;    // HH:MM
  tema?: string;
}

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('taken')
  @HttpCode(HttpStatus.OK)
  async getTaken() {
    const taken = await this.bookingService.getTaken();
    return { taken };
  }

  // El más caro de abusar: cada llamada OCUPA UN HUECO de agenda que luego no
  // se puede vender. Cinco por hora y por IP.
  @Post()
  @Throttle(LIMITE_RESERVA)
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: BookingDto) {
    if (!dto?.nombre?.trim() || !dto?.email?.trim() || !dto?.fecha || !dto?.slot) {
      throw new BadRequestException('Faltan datos obligatorios');
    }
    const result = await this.bookingService.create(dto);
    if (result === 'duplicate') {
      throw new ConflictException('Ese horario ya está reservado');
    }
    if (result === 'error') {
      throw new BadRequestException('No se pudo crear la reserva');
    }
    return { success: true };
  }
}
