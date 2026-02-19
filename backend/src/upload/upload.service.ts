import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class UploadService {
  private supabase;

  constructor(private readonly databaseService: DatabaseService) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("No se encontraron variables de entorno de Supabase.");
    }

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }


  async uploadProfilePic(userId: string, file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop();
    const fileName = `${userId}.${extension}`; // nombre único por usuario
    const bucket = this.supabase.storage.from('img');

    const result = await this.databaseService.query(
      'SELECT img FROM "user" WHERE id = $1',
      [userId]
    );

    const oldUrl = result.rows?.[0]?.img;

    if (oldUrl) {
      const oldPath = oldUrl.split('/img/')[1]; // solo la parte después de img/
      if (oldPath) {
        console.log("Borrando foto anterior del bucket...");
        const { data, error } = await bucket.remove([`img/${oldPath}`]);
        if (error) console.log("Error al borrar foto antigua:", error);
        else console.log("Foto antigua borrada correctamente:", data);
      }
    }

    const { error: uploadError, data: uploadData } = await bucket.upload(
      `img/${fileName}`,
      file.buffer,
      { contentType: file.mimetype, upsert: true, }
    );
    if (uploadError) {
      console.log("Error al subir la foto:", uploadError);
      throw new Error(uploadError.message);
    }

    const publicURL = bucket.getPublicUrl(`img/${fileName}`).data.publicUrl;

    await this.databaseService.query(
      'UPDATE "user" SET img = $1 WHERE id = $2',
      [publicURL, userId]
    );
    return { url: publicURL };
  }


  async getProfilePic(userId: string) {
    const result = await this.databaseService.query(
      'SELECT img FROM "user" WHERE id = $1',
      [userId]
    );

    const filePath = result[0].img;
    return { url: filePath };
  }

}
