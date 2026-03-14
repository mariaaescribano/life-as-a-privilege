import { Body, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';

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

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() dto: ContactDto) {
    await this.contactService.sendContactEmail(dto);
    return { success: true };
  }
}
