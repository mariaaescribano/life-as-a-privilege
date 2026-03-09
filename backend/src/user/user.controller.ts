import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUser, LoginUser, UpdateUser } from "../dtos/user.types";
import { JwtAuthGuard } from '../auth/jwt.guard';

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

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return await this.usersService.getUserById(req.user.userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getById(@Param("id") id: string) {
    return await this.usersService.getUserById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() body: UpdateUser) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id") id: string) {
    return await this.usersService.deleteUser(id);
  }

}
