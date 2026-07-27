import { BadRequestException, Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Req, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService, DISCIPLINAS_ORDEN } from './user.service';
import type { DisciplinaKey } from './user.service';
import type { CreateUser, LoginUser, UpdateUser } from "../dtos/user.types";
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { AuthService } from '../auth/auth.service';
import { isAdminEmail, isAccesoLibreEmail, verifyAdminPassword } from '../auth/admin.util';

// #region user
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("signIn")
  async create(@Body() body: CreateUser) {
    return await this.usersService.createUser(body);
  }

  @Post("logIn")
  async logIn(@Body() body: LoginUser) {
    return await this.usersService.logIn(body);
  }

  // ── Recuperación de contraseña ───────────────────────────────────────────
  // Sin guard: quien la pide justamente NO puede iniciar sesión. La seguridad
  // está en que el enlace solo llega al email registrado y el token caduca en
  // una hora y sirve una sola vez.

  @Post("password/forgot")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email?: string }) {
    await this.usersService.solicitarRecuperacion(body?.email ?? '');
    // Respuesta idéntica exista o no la cuenta: si dijéramos «ese email no está
    // registrado», cualquiera podría usar esto para averiguar quién tiene cuenta.
    return { ok: true };
  }

  @Post("password/reset")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token?: string; password?: string }) {
    if (!body?.token) throw new BadRequestException('Falta el token');
    if (!body?.password) throw new BadRequestException('Falta la contraseña nueva');
    return await this.usersService.restablecerPassword(body.token, body.password);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const user = await this.usersService.getUserById(req.user.userId);
    const email = (user as any)?.email ?? req.user?.email;
    // `admin_email`: el email está en ADMIN_EMAILS (puede pedir la contraseña).
    // `is_admin`: además está DESBLOQUEADO (token emitido tras la contraseña).
    const adminEmail = isAdminEmail(email);

    // Acceso libre: cuentas invitadas (ACCESO_LIBRE_EMAILS) que ven todo el
    // recorrido sin pagar. No se toca la BD, se abre al vuelo en cada respuesta,
    // así que basta con quitar el email de la variable para cerrarlo de nuevo.
    const accesoLibre = isAccesoLibreEmail(email);
    const flagsLibres = accesoLibre
      ? Object.fromEntries(DISCIPLINAS_ORDEN.map((k) => [`${k}_suscrito`, true]))
      : {};

    return {
      ...user,
      ...flagsLibres,
      acceso_libre: accesoLibre,
      admin_email: adminEmail,
      is_admin: adminEmail && req.user?.admin === true,
    };
  }

  // Verifica la contraseña de administración. Si el email está en ADMIN_EMAILS y
  // la contraseña (ADMIN_PASSWORD) es correcta, devuelve un token NUEVO con el
  // permiso de admin activado. Sin este token, el AdminGuard rechaza todo.
  @Post("admin/verify")
  @UseGuards(JwtAuthGuard)
  async verifyAdmin(@Req() req: any, @Body() body: { password?: string }) {
    const email = req.user?.email;
    if (!isAdminEmail(email) || !verifyAdminPassword(body?.password)) {
      throw new ForbiddenException('Credenciales de administración incorrectas');
    }
    const token = this.authService.generateToken(req.user.userId, email, true);
    return { token };
  }

  // Usuarios del recorrido para el panel admin (antes de :id para no colisionar)
  @Get("admin/recorrido")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getRecorrido() {
    return await this.usersService.getRecorridoUsers();
  }

  // ── Accesos: regalar el recorrido a una cuenta sin cobrarle ──────────────
  // Todo lo de aquí exige token de admin DESBLOQUEADO (email en ADMIN_EMAILS +
  // contraseña ADMIN_PASSWORD verificada), igual que el resto del panel. Es la
  // única forma de abrir una disciplina sin pago real: el modo test de pagos
  // está cerrado en producción.

  // Todas las cuentas (con sus disciplinas), para buscar a quien se le regala.
  @Get("admin/todos")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getTodos() {
    const usuarios = await this.usersService.getTodosUsuarios();
    // Marcamos también quién tiene acceso libre por ACCESO_LIBRE_EMAILS, para
    // que el panel no ofrezca «conceder» a quien ya lo tiene por variable.
    return (usuarios as any[]).map((u) => ({ ...u, acceso_libre: isAccesoLibreEmail(u?.email) }));
  }

  @Post("admin/acceso")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async concederAcceso(@Body() body: { userId?: string; hasta?: DisciplinaKey | 'all' }) {
    if (!body?.userId) throw new BadRequestException('userId requerido');
    const hasta = body.hasta ?? 'all';
    if (hasta !== 'all' && !DISCIPLINAS_ORDEN.includes(hasta)) {
      throw new BadRequestException('Disciplina desconocida');
    }
    return await this.usersService.concederAcceso(body.userId, hasta);
  }

  @Post("admin/acceso/revocar")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async revocarAcceso(@Body() body: { userId?: string }) {
    if (!body?.userId) throw new BadRequestException('userId requerido');
    return await this.usersService.revocarAcceso(body.userId);
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
  async remove(@Param("id") id: string, @Body() body: { password?: string }) {
    return await this.usersService.deleteUser(id, body?.password);
  }

}
