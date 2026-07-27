import { Body, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { LIMITE_FORMULARIO } from '../rate-limit';

export class ContactDto {
  nombre: string;
  email: string;
  titulo: string;
  mensaje: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return { ok: true };
  }

  // Sin login a propósito (cualquiera puede escribir), pero acaba en un correo:
  // cinco por hora y por IP.
  @Post()
  @Throttle(LIMITE_FORMULARIO)
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() dto: ContactDto) {
    await this.contactService.sendContactEmail(dto);
    return { success: true };
  }
}
