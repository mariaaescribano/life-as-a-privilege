import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class AyurvedaService {
  constructor(private readonly databaseService: DatabaseService) {}

  /* POST — guardar resultado + respuestas */
  async saveResultado(
    userId: string,
    dosha: string,
    vataScore: number,
    pittaScore: number,
    kaphaScore: number,
    respuestas: Array<{ preguntaIdx: number; pregunta: string; doshaElegida: string }>,
  ): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      // Borrar resultado previo
      await db.from('ayurveda').delete().eq('userId', userId);

      const { error } = await db.from('ayurveda').insert({
        userId,
        dosha,
        vata_score: vataScore,
        pitta_score: pittaScore,
        kapha_score: kaphaScore,
        fecha: new Date().toISOString().split('T')[0],
      });
      if (error) throw error;

      // Borrar respuestas previas y reinsertar
      await db.from('ayurveda_respuestas').delete().eq('user_id', userId);

      const rows = respuestas.map((r) => ({
        user_id: userId,
        pregunta_idx: r.preguntaIdx,
        pregunta: r.pregunta,
        dosha_elegida: r.doshaElegida,
      }));
      const { error: errResp } = await db.from('ayurveda_respuestas').insert(rows);
      if (errResp) throw errResp;

      return true;
    } catch (error) {
      console.error('Error en saveResultado:', error);
      return false;
    }
  }

  /* GET — resultado del usuario */
  async getResultado(userId: string): Promise<{
    dosha: string;
    vata_score: number;
    pitta_score: number;
    kapha_score: number;
    fecha: string;
  } | null> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('ayurveda')
        .select('dosha, vata_score, pitta_score, kapha_score, fecha')
        .eq('userId', userId)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    } catch (error) {
      console.error('Error en getResultado:', error);
      return null;
    }
  }

  /* GET — respuestas individuales */
  async getRespuestas(userId: string): Promise<
    Array<{ pregunta_idx: number; pregunta: string; dosha_elegida: string }>
  > {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('ayurveda_respuestas')
        .select('pregunta_idx, pregunta, dosha_elegida')
        .eq('user_id', userId)
        .order('pregunta_idx', { ascending: true });

      if (error) throw error;
      return data ?? [];
    } catch (error) {
      console.error('Error en getRespuestas:', error);
      return [];
    }
  }

  /* DELETE — borrar todo del usuario */
  async deleteResultado(userId: string): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();
      await db.from('ayurveda_respuestas').delete().eq('user_id', userId);
      await db.from('ayurveda').delete().eq('userId', userId);
      return true;
    } catch (error) {
      console.error('Error en deleteResultado:', error);
      return false;
    }
  }
}
