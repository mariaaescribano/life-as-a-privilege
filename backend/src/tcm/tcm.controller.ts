import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TcmService } from './tcm.service';

@Controller('tcm')
export class TcmController {
  constructor(private readonly tcmService: TcmService) {}

  /* POST /tcm/constitucion
     Body: { userId: string, constitucion: string }
     Guarda el resultado del Test 1 */
  @Post('constitucion')
  async saveConstitucion(@Body() body: { userId: string; constitucion: string }) {
    return await this.tcmService.saveConstitucion(body.userId, body.constitucion);
  }

  /* POST /tcm/elemento
     Body: { userId: string, elemento: string }
     Guarda el resultado del Test 2 */
  @Post('elemento')
  async saveElemento(@Body() body: { userId: string; elemento: string }) {
    return await this.tcmService.saveElemento(body.userId, body.elemento);
  }

  /* POST /tcm/desequilibrio
     Body: { userId: string, desequilibrio: string }
     Guarda el resultado del Test 3 */
  @Post('desequilibrio')
  async saveDesequilibrio(@Body() body: { userId: string; desequilibrio: string }) {
    return await this.tcmService.saveDesequilibrio(body.userId, body.desequilibrio);
  }

  /* POST /tcm/respuestas
     Body: { userId, testNum, respuestas: [{seccion, preguntaIdx, pregunta, respuesta}] }
     Guarda todas las respuestas individuales de un test */
  @Post('respuestas')
  async saveRespuestas(
    @Body()
    body: {
      userId: string;
      testNum: number;
      respuestas: Array<{
        seccion: string;
        preguntaIdx: number;
        pregunta: string;
        respuesta: number;
      }>;
    },
  ) {
    return await this.tcmService.saveRespuestas(
      body.userId,
      body.testNum,
      body.respuestas,
    );
  }

  /* GET /tcm/:userId
     Devuelve los datos TCM del usuario (constitución, elemento, desequilibrio) */
  @Get(':userId')
  async getTcmData(@Param('userId') userId: string) {
    return await this.tcmService.getTcmData(userId);
  }
}
