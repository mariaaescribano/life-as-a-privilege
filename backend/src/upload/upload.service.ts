import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database.service';

@Injectable()
export class UploadService {
  constructor(private readonly databaseService: DatabaseService) {}

  async uploadProfilePic(userId: string, file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop();
    // Nombre único en cada subida: así la URL pública SIEMPRE cambia y ninguna
    // caché (navegador o CDN de Supabase) puede seguir sirviendo la foto vieja.
    const fileName = `${userId}-${Date.now()}.${extension}`;
    const bucket = this.databaseService.getClient().storage.from('img');

    const { data: userData } = await this.databaseService.getClient()
      .from('user')
      .select('img')
      .eq('id', userId);

    const oldUrl = userData?.[0]?.img;

    if (oldUrl) {
      // Ruta DENTRO del bucket 'img' = todo lo que viene tras '/public/img/'.
      // (La URL pública es .../public/img/img/<archivo>, con la carpeta 'img'.)
      const oldPath = oldUrl.split('?')[0].split('/public/img/')[1];
      if (oldPath) {
        console.log("Borrando foto anterior del bucket...");
        const { data, error } = await bucket.remove([oldPath]);
        if (error) console.log("Error al borrar foto antigua:", error);
        else console.log("Foto antigua borrada correctamente:", data);
      }
    }

    const { error: uploadError } = await bucket.upload(
      `img/${fileName}`,
      file.buffer,
      { contentType: file.mimetype, upsert: true }
    );
    if (uploadError) {
      console.log("Error al subir la foto:", uploadError);
      throw new Error(uploadError.message);
    }

    const publicURL = bucket.getPublicUrl(`img/${fileName}`).data.publicUrl;

    await this.databaseService.getClient()
      .from('user')
      .update({ img: publicURL })
      .eq('id', userId);

    return { url: publicURL };
  }

  async getProfilePic(userId: string) {
    const { data } = await this.databaseService.getClient()
      .from('user')
      .select('img')
      .eq('id', userId);

    return { url: data?.[0]?.img };
  }
}
