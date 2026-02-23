import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { Respuesta } from 'src/dtos/respuesta.types';

@Injectable()
export class RespuestaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async postRespuesta(body: Respuesta): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      // 1️⃣ Borrar si ya existe
      await db
        .from('respuesta')
        .delete()
        .eq('userid', body.userId)
        .eq('pregid', body.idPregunta);

      // 2️⃣ Insertar nueva respuesta
      const { error } = await db
        .from('respuesta')
        .insert({ userid: body.userId, pregid: body.idPregunta, respuesta: body.respuesta });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error en postRespuesta:", error);
      return false;
    }
  }

  async getRespuestaDePregunta(pregId: string, userId: string): Promise<Respuesta> {
    try {
      const { data, error } = await this.databaseService.getClient()
        .from('respuesta')
        .select('*')
        .eq('userid', userId)
        .eq('pregid', pregId);

      if (error) throw error;

      return data?.[0];
    } catch (error) {
      console.log("Error en getRespuestaDePregunta:", error);
      throw new Error(error);
    }
  }
}
