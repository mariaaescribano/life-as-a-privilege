import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import * as multer from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

 @Post('profile-pic')
@UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
async uploadProfilePic(
  @UploadedFile() file: Express.Multer.File,
  @Body('userId') userId: string
) {
  // Aquí usamos el servicio que sube al bucket 'img'
  return this.uploadService.uploadProfilePic(userId, file);
}

}
