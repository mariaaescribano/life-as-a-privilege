import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUser, LoginUser } from "../dtos/user.types";

@Controller('/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post("/signIn")
  async create(@Body() body: CreateUser) {
    return await this.usersService.createUser(body);
  }

  @Post("/logIn")
  async logIn(@Body() body: LoginUser) {
    return await this.usersService.logIn(body);
  }

  @Get()
  getUser() {
    return this.usersService.getUser();
  }

}
