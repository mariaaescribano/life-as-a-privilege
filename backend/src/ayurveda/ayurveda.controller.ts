import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AyurvedaService } from './ayurveda.service';

@Controller('ayurveda')
export class AyurvedaController {
  constructor(private readonly ayurvedaService: AyurvedaService) {}

  /* POST /ayurveda/resultado
     Body: { userId, dosha, vataScore, pittaScore, kaphaScore, respuestas } */
  @Post('resultado')
  async saveResultado(
    @Body()
    body: {
      userId: string;
      dosha: string;
      vataScore: number;
      pittaScore: number;
      kaphaScore: number;
      respuestas: Array<{ preguntaIdx: number; pregunta: string; doshaElegida: string }>;
    },
  ) {
    return await this.ayurvedaService.saveResultado(
      body.userId,
      body.dosha,
      body.vataScore,
      body.pittaScore,
      body.kaphaScore,
      body.respuestas,
    );
  }

  /* GET /ayurveda/respuestas/:userId
     Devuelve las respuestas individuales — debe ir ANTES de /:userId */
  @Get('respuestas/:userId')
  async getRespuestas(@Param('userId') userId: string) {
    return await this.ayurvedaService.getRespuestas(userId);
  }

  /* GET /ayurveda/:userId
     Devuelve el resultado del usuario */
  @Get(':userId')
  async getResultado(@Param('userId') userId: string) {
    return await this.ayurvedaService.getResultado(userId);
  }

  /* DELETE /ayurveda/:userId
     Borra resultado y respuestas del usuario */
  @Delete(':userId')
  async deleteResultado(@Param('userId') userId: string) {
    return await this.ayurvedaService.deleteResultado(userId);
  }
}
