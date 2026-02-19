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
  const extension = file.originalname.split('.').pop(); // jpg, png, etc
  const fileName = `${userId}.${extension}`;           // archivo único por usuario

  const bucket = this.supabase.storage.from('img');

  // 1️⃣ Revisar si ya hay foto
  const result = await this.databaseService.query(
    'SELECT img FROM "user" WHERE id = $1',
    [userId]
  );
  const oldUrl = result.rows[0]?.img;

  if (oldUrl) {
    // Extraer el path dentro del bucket
    const oldPath = oldUrl.split('/img/')[1]; // solo la parte después de img/
    if (oldPath) {
      await bucket.remove([`img/${oldPath}`]); // borrar la antigua
    }
  }

  // 2️⃣ Subir la nueva foto (nombre único)
  const { error } = await bucket.upload(`img/${fileName}`, file.buffer, {
    contentType: file.mimetype,
  });
  if (error) throw new Error(error.message);

  // 3️⃣ Obtener URL pública
  const publicURL = bucket.getPublicUrl(`img/${fileName}`).data.publicUrl;

  // 4️⃣ Guardar URL en DB
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

    const filePath = result.rows[0].img;

    const { data, error } = await this.supabase.storage
      .from('img')
      .createSignedUrl(filePath, 60 * 5); // 5 minutos

    if (error) throw new Error(error.message);

    return { url: data.signedUrl };
  }


}
