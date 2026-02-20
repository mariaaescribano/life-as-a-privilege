import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUser, LoginUser } from "../dtos/user.types";
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname, join } from "path";
const uploadFolder = join(process.cwd(), 'img');

// #region multer

if (!existsSync(uploadFolder)) {
  mkdirSync(uploadFolder, { recursive: true });
}

const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      const userId = req.params.userId;
      const extension = extname(file.originalname); 
      cb(null, `${userId}${extension}`); 
    },
  }),
};

// #region user
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post("signIn")
  async create(@Body() body: CreateUser) {
    return await this.usersService.createUser(body);
  }

  @Post("logIn")
  async logIn(@Body() body: LoginUser) {
    return await this.usersService.logIn(body);
  }


  // @Post("/img/:userId")
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor("imagen", multerOptions))
  // async uploadProfilePic(
  //   @Param("userId") userId: string,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   return await this.usersService.perfilPicPost(userId, file);
  // }

  // @Get('/img/:userId')
  // @UseGuards(JwtAuthGuard)
  // async getProfilePic(@Param('userId') userId: string) {
  //   return this.usersService.getProfilePic(userId);
  // }

}
