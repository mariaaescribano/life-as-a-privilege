import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { Opinion, OpinionInput } from 'src/dtos/opinion.types';
import { randomString } from 'src/Global';

@Injectable()
export class OpinionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(body: OpinionInput): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();
      const id = randomString(12);
      const { error } = await db.from('opinion').insert({
        id,
        nombre: body.nombre,
        texto: body.texto,
        email: body.email ?? null,
        aprobada: false,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error en OpinionService.create:', error);
      return false;
    }
  }

  async findAprobadas(): Promise<Opinion[]> {
    try {
      const { data, error } = await this.databaseService.getClient()
        .from('opinion')
        .select('id, nombre, texto, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      console.error('Error en OpinionService.findAprobadas:', error);
      return [];
    }
  }
}
