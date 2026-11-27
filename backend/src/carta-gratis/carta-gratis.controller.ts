import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CartaGratisService } from './carta-gratis.service';
import { LIMITE_FORMULARIO } from '../rate-limit';

export class CartaGratisDto {
  nombre: string;
  email: string;
  /** YYYY-MM-DD */
  fecha: string;
  /** HH:MM */
  hora: string;
  pais: string;
  region: string;
  ciudad: string;
  consentimiento: boolean;
}

const texto = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

@Controller('carta-gratis')
export class CartaGratisController {
  constructor(private readonly service: CartaGratisService) {}

  // Sin login a propósito (cualquiera puede pedirla), pero acaba en un correo a María: cinco por hora y por IP.
  @Post()
  @Throttle(LIMITE_FORMULARIO)
  @HttpCode(HttpStatus.OK)
  async pedir(@Body() body: CartaGratisDto) {
    const dto: CartaGratisDto = {
      nombre: texto(body?.nombre, 120),
      email: texto(body?.email, 160),
      fecha: texto(body?.fecha, 10),
      hora: texto(body?.hora, 5),
      pais: texto(body?.pais, 60),
      region: texto(body?.region, 60),
      ciudad: texto(body?.ciudad, 60),
      consentimiento: body?.consentimiento === true,
    };
    const completo = [dto.nombre, dto.email, dto.fecha, dto.hora, dto.pais, dto.region, dto.ciudad].every(Boolean);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email);
    const fechaOk = /^\d{4}-\d{2}-\d{2}$/.test(dto.fecha) && !Number.isNaN(Date.parse(dto.fecha));
    const horaOk = /^([01]\d|2[0-3]):[0-5]\d$/.test(dto.hora);
    if (!completo || !emailOk || !fechaOk || !horaOk || !dto.consentimiento) {
      throw new BadRequestException('Datos incompletos o no válidos');
    }
    await this.service.enviar(dto);
    return { success: true };
  }
}
