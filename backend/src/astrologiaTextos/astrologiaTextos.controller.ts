import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AstrologiaTextosService } from './astrologiaTextos.service';
import type { ArquetiposOverrides } from './astrologiaTextos.types';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('astrologia-arquetipos')
export class AstrologiaTextosController {
  constructor(private readonly service: AstrologiaTextosService) {}

  // ── Admin (local): reescribe el archivo de overrides del proyecto ──
  @Put()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async guardar(@Body() body: { overrides: ArquetiposOverrides }) {
    return await this.service.guardarOverrides(body?.overrides);
  }
}
