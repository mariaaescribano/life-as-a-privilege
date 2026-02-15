import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() body: Partial<User>) 
  {
    return await this.usersService.createUser(body);
  }

  @Get(":userId")
  getUser(@Param('userId') userId: string) {
    //return this.usersService.getUser(userId);
  }

}
