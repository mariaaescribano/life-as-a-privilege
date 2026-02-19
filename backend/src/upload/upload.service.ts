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
  const fileName = `img/${userId}_${Date.now()}_${file.originalname}`;

  const { data, error } = await this.supabase.storage
    .from('img')
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) throw new Error(error.message);

  const publicURL = this.supabase.storage.from('img').getPublicUrl(fileName).data.publicUrl;

  // Guardar URL en DB
  await this.databaseService.query(
    'UPDATE "user" SET img = $1 WHERE id = $2',
    [publicURL, userId]
  );

  return { url: publicURL };
}

}
