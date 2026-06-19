import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import * as multer from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Subir/sobrescribir la foto requiere ser el dueño (o admin). El userId va en
  // la URL (param), NO en el body: los guards se ejecutan ANTES que el
  // FileInterceptor (multer), así que el body multipart aún no está parseado
  // cuando OwnerGuard necesita leer el userId. Desde la URL sí está disponible.
  @Post('profile-pic/:userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadProfilePic(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string
  ) {
    return this.uploadService.uploadProfilePic(userId, file);
  }

  // La foto se sirve desde un bucket público: el GET solo devuelve esa URL
  // pública, así que no se exige token (se consulta al hacer login, etc.).
  @Get('profile-pic/:userId')
  async getProfilePic(@Param('userId') userId: string) {
    return this.uploadService.getProfilePic(userId);
  }


}
