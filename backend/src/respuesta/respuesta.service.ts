import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { Respuesta } from 'src/dtos/respuesta.types';

@Injectable()
export class RespuestaService {
  constructor(private readonly databaseService: DatabaseService) {}

  async postRespuesta(body: Respuesta): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      // UPDATE si ya existe la respuesta (userid+pregid), INSERT si no. Evita la
      // ventana de pérdida del patrón anterior (borrar y luego insertar).
      const { data: existing } = await db
        .from('neuroPsicologia')
        .select('pregid')
        .eq('userid', body.userId)
        .eq('pregid', body.idPregunta)
        .limit(1);

      const { error } = (existing?.length ?? 0) > 0
        ? await db
            .from('neuroPsicologia')
            .update({ respuesta: body.respuesta })
            .eq('userid', body.userId)
            .eq('pregid', body.idPregunta)
        : await db
            .from('neuroPsicologia')
            .insert({ userid: body.userId, pregid: body.idPregunta, respuesta: body.respuesta });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error en postRespuesta:", error);
      return false;
    }
  }

  async getRespuestaDePregunta(pregId: string, userId: string): Promise<Respuesta | null> {
    try {
      const { data, error } = await this.databaseService.getClient()
        .from('neuroPsicologia')
        .select('*')
        .eq('userid', userId)
        .eq('pregid', pregId);

      if (error) throw error;

      return data?.[0] ?? null;
    } catch (error) {
      console.error("Error en getRespuestaDePregunta:", error);
      throw error instanceof Error ? error : new Error(JSON.stringify(error));
    }
  }
}
