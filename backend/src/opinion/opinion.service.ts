import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DatabaseService } from 'src/database.service';
import { Opinion, OpinionInput } from 'src/dtos/opinion.types';
import { randomString } from 'src/Global';

/**
 * COPIA DE SEGURIDAD en el proyecto: `backend/data/opiniones.json`, para commitear con el código.
 * Lleva nombre, texto y fecha. NUNCA el correo: el repositorio no es sitio para datos de contacto.
 */
const COPIA_PATH = path.resolve(process.cwd(), 'data', 'opiniones.json');

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
      // Ya está en la BD; la copia local es un extra y nunca hace fallar el envío.
      await this.guardarCopiaLocal();
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

  /**
   * Reescribe `backend/data/opiniones.json` con TODAS las opiniones de la BD (de la más antigua a la
   * más nueva). Solo fuera de producción: en Render el disco se borra y la carpeta no existe. No lanza.
   */
  async guardarCopiaLocal(): Promise<boolean> {
    if (process.env.NODE_ENV === 'production') return false;
    try {
      await fs.access(path.dirname(COPIA_PATH));
      const { data, error } = await this.databaseService.getClient()
        .from('opinion')
        .select('id, nombre, texto, created_at')
        .order('created_at', { ascending: true });
      if (error) throw error;
      await fs.writeFile(COPIA_PATH, JSON.stringify(data ?? [], null, 2) + '\n', 'utf8');
      return true;
    } catch (e) {
      console.warn('[opinion] no se pudo escribir la copia local:', e instanceof Error ? e.message : e);
      return false;
    }
  }
}
