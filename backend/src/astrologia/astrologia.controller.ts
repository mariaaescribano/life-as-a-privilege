import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AstrologiaService } from './astrologia.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('astrologia')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class AstrologiaController {
  constructor(private readonly astrologiaService: AstrologiaService) {}

  @Post('sol')
  async saveSol(@Body() body: { userId: string; sol: string }) {
    return await this.astrologiaService.saveSol(body.userId, body.sol);
  }

  @Post('luna')
  async saveLuna(@Body() body: { userId: string; luna: string }) {
    return await this.astrologiaService.saveLuna(body.userId, body.luna);
  }

  @Post('ascendente')
  async saveAscendente(@Body() body: { userId: string; ascendente: string }) {
    return await this.astrologiaService.saveAscendente(body.userId, body.ascendente);
  }

  @Post('clear')
  async clearField(@Body() body: { userId: string; field: 'sol' | 'luna' | 'ascendente' }) {
    return await this.astrologiaService.clearField(body.userId, body.field);
  }

  @Get(':userId')
  async getAstrologiaData(@Param('userId') userId: string) {
    return await this.astrologiaService.getAstrologiaData(userId);
  }
}
