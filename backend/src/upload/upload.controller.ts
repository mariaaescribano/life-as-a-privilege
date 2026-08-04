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

  // Fotos del GENOGRAMA («Tu familia», recorrido de psicología). Cada familiar
  // que la usuaria añade puede llevar su foto. NO se guardan en la columna
  // `data` del recorrido (el JSON tiene un límite de tamaño y unas pocas fotos
  // en base64 lo reventarían): se suben al bucket y en `data` va solo la URL.
  // Mismos guards que la foto de perfil: solo el dueño (o un admin) sube.
  @Post('genograma/:userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadGenogramaPic(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string
  ) {
    return this.uploadService.uploadGenogramaPic(userId, file);
  }
}
