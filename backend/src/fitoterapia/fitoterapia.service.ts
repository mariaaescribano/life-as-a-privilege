import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class FitoterapiaService {
  constructor(private readonly databaseService: DatabaseService) {}

  /* POST — guardar favorito */
  async addFavorito(idPlanta: number, idUser: string): Promise<boolean> {
    try {
      const db = this.databaseService.getClient();

      // Evitar duplicados: borrar si ya existe y reinsertar
      await db
        .from('fitoterapia')
        .delete()
        .eq('idUser', idUser)
        .eq('idPlanta', idPlanta);

      const { error } = await db
        .from('fitoterapia')
        .insert({ idPlanta, idUser });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error en addFavorito:', error);
      return false;
    }
  }

  /* GET — favoritos de un usuario */
  async getFavoritosByUser(idUser: string): Promise<{ idPlanta: number; idUser: string }[]> {
    try {
      const { data, error } = await this.databaseService
        .getClient()
        .from('fitoterapia')
        .select('*')
        .eq('idUser', idUser);

      if (error) throw error;

      return data ?? [];
    } catch (error) {
      console.error('Error en getFavoritosByUser:', error);
      return [];
    }
  }

  /* DELETE — quitar favorito */
  async removeFavorito(idUser: string, idPlanta: number): Promise<boolean> {
    try {
      const { error } = await this.databaseService
        .getClient()
        .from('fitoterapia')
        .delete()
        .eq('idUser', idUser)
        .eq('idPlanta', idPlanta);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error en removeFavorito:', error);
      return false;
    }
  }
}
