import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { EstudioService } from './estudio.service';
import type { DatosParticipante, Eje } from './estudio.service';
import { LIMITE_ESTUDIO, LIMITE_ESTUDIO_RESPUESTA } from '../rate-limit';

/**
 * Estudio estadístico sobre astrología. Rutas PÚBLICAS a propósito: participar
 * no exige cuenta, solo dejar un email. El alta lleva límite por IP (calcular
 * una carta implica una llamada a Nominatim); responder preguntas se queda con
 * el límite general, que hay muchas.
 */
@Controller('estudio')
export class EstudioController {
  constructor(private readonly service: EstudioService) {}

  /** Alta o corrección de participante: guarda sus datos y calcula su carta. */
  @Post('participante')
  @Throttle(LIMITE_ESTUDIO)
  @HttpCode(HttpStatus.OK)
  async guardarParticipante(@Body() body: DatosParticipante) {
    return await this.service.guardarParticipante(body);
  }

  /** Sus datos + lo que ya haya respondido (para no repetir preguntas). */
  @Get('participante/:id')
  async getParticipante(@Param('id') id: string) {
    return await this.service.getParticipante(id);
  }

  /** Una respuesta Sí/No. Se guarda al momento, pregunta a pregunta. El `eje`
   *  dice si la pregunta era del signo o de la casa; la posición concreta la
   *  pone el servidor leyendo la carta guardada, no el navegador. */
  @Post('respuesta')
  @Throttle(LIMITE_ESTUDIO_RESPUESTA)
  @HttpCode(HttpStatus.OK)
  async guardarRespuesta(
    @Body() body: {
      participanteId: string;
      planeta: string;
      eje: Eje;
      preguntaId: string;
      respuesta: boolean;
    },
  ) {
    return await this.service.guardarRespuesta(
      body.participanteId,
      body.planeta,
      body.eje,
      body.preguntaId,
      body.respuesta,
    );
  }

  /** Resultado final: su respuesta frente a la de todo el mundo con su mismo signo. */
  @Get('estadisticas/:id')
  async getEstadisticas(@Param('id') id: string) {
    return await this.service.getEstadisticas(id);
  }
}
