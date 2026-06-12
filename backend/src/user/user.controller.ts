import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUser, LoginUser, UpdateUser } from "../dtos/user.types";
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { isAdminEmail } from '../auth/admin.util';

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
    const user = await this.usersService.getUserById(req.user.userId);
    // is_admin se deriva del email real del usuario contra ADMIN_EMAILS (no es columna de BD).
    return { ...user, is_admin: isAdminEmail((user as any)?.email ?? req.user?.email) };
  }

  // Usuarios del recorrido para el panel admin (antes de :id para no colisionar)
  @Get("admin/recorrido")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getRecorrido() {
    return await this.usersService.getRecorridoUsers();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async getById(@Param("id") id: string) {
    return await this.usersService.getUserById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async update(@Param("id") id: string, @Body() body: UpdateUser) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async remove(@Param("id") id: string) {
    return await this.usersService.deleteUser(id);
  }

}
