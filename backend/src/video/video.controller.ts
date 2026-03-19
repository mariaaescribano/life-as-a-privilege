import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  constructor(private storageService: VideoService) {}

  // POST Upload video
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const path = await this.storageService.uploadVideo(file);
    return { path };
  }

  // GET video URL
  @Get(':path')
  async getVideo(@Param('path') path: string) {
    const url = await this.storageService.getSignedUrl(path);
    return { url };
  }
}