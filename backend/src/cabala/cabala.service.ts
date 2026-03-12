import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { Respuesta } from 'src/dtos/respuesta.types';

@Injectable()
export class CabalaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async postRespuesta(body: Respuesta): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();
      await db.from('cabala').delete().eq('userid', body.userId).eq('pregid', body.idPregunta);
      const { error } = await db.from('cabala').insert({ userid: body.userId, pregid: body.idPregunta, respuesta: body.respuesta });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error en cabala postRespuesta:', error);
      return false;
    }
  }

  async getRespuestaDePregunta(pregId: string, userId: string): Promise<Respuesta> {
    try {
      const { data, error } = await this.databaseService.getClient()
        .from('cabala').select('*').eq('userid', userId).eq('pregid', pregId);
      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.log('Error en cabala getRespuestaDePregunta:', error);
      throw new Error(error);
    }
  }
}
