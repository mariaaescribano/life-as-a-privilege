import {
  Controller, Post, UploadedFile, UseInterceptors, Get, Param, UseGuards,
  BadRequestException, PayloadTooLargeException, Catch, UseFilters,
  type ArgumentsHost, type ExceptionFilter,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { AdminGuard } from '../auth/admin.guard';
import * as multer from 'multer';

/**
 * Opciones de TODAS las subidas. Antes cada endpoint llevaba solo
 * `memoryStorage()` y ningún límite, y eso era un agujero: multer guarda el
 * archivo ENTERO en la memoria del servidor antes de que nadie lo mire, así que
 * un móvil subiendo un vídeo de 300 MB por error se llevaba por delante el
 * backend (Render nos da 512 MB de RAM). El navegador ya comprueba el tamaño,
 * pero esa comprobación se salta cualquiera con una sesión abierta: el límite
 * de verdad tiene que estar aquí.
 *
 * 8 MB es de sobra para una foto: el frontend las encoge a ~600 px antes de
 * enviarlas (ver `encogerFoto`), así que lo normal son 40 kB. Este tope es la
 * red de seguridad, no la medida esperada.
 */
const MAX_BYTES = 8 * 1024 * 1024;

const OPCIONES_FOTO: multer.Options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  // Solo imágenes. Sin esto, el endpoint acepta cualquier cosa con tal de que
  // pese menos de 8 MB (un .zip, un ejecutable) y acaba en el bucket público.
  fileFilter: (_req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      // Un solo argumento: así lo tipa multer para «rechaza y explica por qué»
      // (con dos, el primero tiene que ser null).
      return cb(new BadRequestException('Solo se pueden subir imágenes.'));
    }
    cb(null, true);
  },
};

/**
 * Cuando multer corta una subida por pasarse de tamaño lanza un `MulterError`,
 * que Nest no conoce y convierte en un 500 «error interno» — un mensaje que no
 * le dice nada a quien está intentando subir su foto. Esto lo traduce a un 413
 * con una frase que sí se entiende.
 */
@Catch()
class ErroresDeSubidaFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const e = exception as { name?: string; code?: string };
    if (e?.name === 'MulterError' && e.code === 'LIMIT_FILE_SIZE') {
      return super.catch(
        new PayloadTooLargeException(`La foto es demasiado grande (máximo ${MAX_BYTES / 1024 / 1024} MB).`),
        host,
      );
    }
    return super.catch(exception, host);
  }
}

@Controller('upload')
@UseFilters(ErroresDeSubidaFilter)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Subir/sobrescribir la foto requiere ser el dueño (o admin). El userId va en
  // la URL (param), NO en el body: los guards se ejecutan ANTES que el
  // FileInterceptor (multer), así que el body multipart aún no está parseado
  // cuando OwnerGuard necesita leer el userId. Desde la URL sí está disponible.
  @Post('profile-pic/:userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @UseInterceptors(FileInterceptor('file', OPCIONES_FOTO))
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
  @UseInterceptors(FileInterceptor('file', OPCIONES_FOTO))
  async uploadGenogramaPic(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: string
  ) {
    return this.uploadService.uploadGenogramaPic(userId, file);
  }

  // Portada de un VÍDEO (sección «Vídeos»). Solo la admin: es contenido del
  // sitio, no del usuario, así que aquí no vale OwnerGuard sino AdminGuard.
  @Post('portada-video')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file', OPCIONES_FOTO))
  async uploadPortadaVideo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadPortadaVideo(file);
  }
}
