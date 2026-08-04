import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { EstudioService } from './estudio.service';
import type { DatosParticipante, Eje } from './estudio.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
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

  /** Los totales del estudio, sin nadie dentro: la media de cada arquetipo en
   *  cada posición. Público (es lo que se le prometió a quien participa: los
   *  resultados se publican en conjunto) y cacheado en el servicio. */
  @Get('resultados')
  async getResultados() {
    return await this.service.getResultadosPublicos();
  }

  /** Resultado final: su respuesta frente a la de todo el mundo con su mismo signo. */
  @Get('estadisticas/:id')
  async getEstadisticas(@Param('id') id: string) {
    return await this.service.getEstadisticas(id);
  }

  /* ── Panel de administración ──────────────────────────────────────────────
   * Lo ÚNICO del estudio que no es público. Exige token de admin desbloqueado
   * (email en ADMIN_EMAILS + contraseña verificada), igual que el resto del
   * panel: aquí se ven los emails de quien participa, que son datos personales. */

  /** Quién ha participado: email, cuándo, y cuánto lleva respondido. */
  @Get('admin/participantes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async adminParticipantes() {
    return await this.service.getAdminParticipantes();
  }

  /** Cómo van los resultados: el agregado de TODAS las respuestas. */
  @Get('admin/resultados')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async adminResultados() {
    return await this.service.getAdminResultados();
  }
}
