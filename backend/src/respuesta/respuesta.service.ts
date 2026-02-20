import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';
import { Respuesta } from 'src/dtos/respuesta.types';

@Injectable()
export class RespuestaService {
  constructor(private readonly databaseService: DatabaseService) {}

    async postRespuesta(body: Respuesta): Promise<boolean> {
        try {
            // 1️⃣ Verificar si ya existe
            const checkResult = await this.databaseService.query(
                `SELECT * FROM respuesta WHERE userid = $1 AND pregid = $2`,
                [body.userId, body.idPregunta]
            );

            if (checkResult.length > 0) {
            // 2️⃣ Borrar si existe
            await this.databaseService.query(
                `DELETE FROM respuesta WHERE userid = $1 AND pregid = $2`,
                [body.userId, body.idPregunta]
            );
            }

            // 3️⃣ Insertar nueva respuesta
            const insertResult = await this.databaseService.query(
                `INSERT INTO respuesta (userid, pregid, respuesta)
                VALUES ($1, $2, $3)`,
                [body.userId, body.idPregunta, body.respuesta]
            );

            return true;
        } catch (error) {
            console.error("Error en postRespuesta:", error);
            return false;
        }
    }

    async getRespuestaDePregunta(pregId:string, userId:string): Promise<Respuesta> {
        try {
            const result = await this.databaseService.query(
            `SELECT * FROM respuesta WHERE userid = $1 AND pregid = $2`,
            [userId, pregId]
            );

            return result[0];
            
        } catch (error) {
            console.log("Error en getRespuestaDePregunta:", error);
            throw new Error(error);
        }
    }
}
