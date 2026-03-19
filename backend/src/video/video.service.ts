import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class VideoService {

  private storage = new Storage({
    credentials: JSON.parse(
      process.env.GOOGLE_CREDENTIALS_JSON || "{}"
    )
  });

  private bucket = this.storage.bucket(
    process.env.GCS_BUCKET_NAME ?? ""
  );

  async uploadVideo(file: Express.Multer.File) {

    if (!file) throw new Error("File missing");

    const fileName = `videos/${Date.now()}-${file.originalname}`;

    const blob = this.bucket.file(fileName);

    await blob.save(file.buffer, {
      contentType: file.mimetype,
    });

    return fileName;
  }

  async getSignedUrl(path: string) {

    const [url] = await this.bucket.file(path).getSignedUrl({
      action: 'read',
      expires: Date.now() + 3600 * 1000,
    });

    return url;
  }
}