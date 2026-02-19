import { Controller, Post, UploadedFile, UseInterceptors, Body, Get, Param } from '@nestjs/common';
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
    return this.uploadService.uploadProfilePic(userId, file);
  }

  @Get('profile-pic/:userId')
  async getProfilePic(@Param('userId') userId: string) {
    return this.uploadService.getProfilePic(userId);
  }


}
