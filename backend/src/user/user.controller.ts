import { BadRequestException, Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Req, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService, DISCIPLINAS_ORDEN } from './user.service';
import type { DisciplinaKey } from './user.service';
import type { CreateUser, LoginUser, UpdateUser } from "../dtos/user.types";
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { AuthService } from '../auth/auth.service';
import { Throttle } from '@nestjs/throttler';
import { isAdminEmail, isAccesoLibreEmail, verifyAdminPassword } from '../auth/admin.util';
import { LIMITE_AUTH } from '../rate-limit';

// #region user
@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Los cuatro de abajo frenan la fuerza bruta (probar contraseñas o emails en
  // masa): diez intentos cada cinco minutos por IP.
  @Post("signIn")
  @Throttle(LIMITE_AUTH)
  async create(@Body() body: CreateUser) {
    return await this.usersService.createUser(body);
  }

  @Post("logIn")
  @Throttle(LIMITE_AUTH)
  async logIn(@Body() body: LoginUser) {
    return await this.usersService.logIn(body);
  }

  // ── Confirmación de la cuenta (enlace del correo de bienvenida) ──────────
  @Post("confirmar")
  @Throttle(LIMITE_AUTH)
  @HttpCode(HttpStatus.OK)
  async confirmar(@Body() body: { token?: string }) {
    if (!body?.token) throw new BadRequestException('Falta el token');
    return await this.usersService.confirmarCuenta(body.token);
  }

  @Post("confirmar/reenviar")
  @Throttle(LIMITE_AUTH)
  @HttpCode(HttpStatus.OK)
  async reenviarConfirmacion(@Body() body: { name?: string }) {
    await this.usersService.reenviarConfirmacion(body?.name ?? '');
    return { ok: true };
  }

  // ── Recuperación de contraseña ───────────────────────────────────────────
  // Sin guard: quien la pide justamente NO puede iniciar sesión. La seguridad
  // está en que el enlace solo llega al email registrado y el token caduca en
  // una hora y sirve una sola vez.

  @Post("password/forgot")
  @Throttle(LIMITE_AUTH)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email?: string }) {
    await this.usersService.solicitarRecuperacion(body?.email ?? '');
    // Respuesta idéntica exista o no la cuenta: si dijéramos «ese email no está
    // registrado», cualquiera podría usar esto para averiguar quién tiene cuenta.
    return { ok: true };
  }

  @Post("password/reset")
  @Throttle(LIMITE_AUTH)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token?: string; password?: string }) {
    if (!body?.token) throw new BadRequestException('Falta el token');
    if (!body?.password) throw new BadRequestException('Falta la contraseña nueva');
    return await this.usersService.restablecerPassword(body.token, body.password);
  }

  // Popup de la comunidad: sale la primera vez que entra y nunca más.
  @Post("me/comunidad-popup")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async comunidadPopupVisto(@Req() req: any) {
    return await this.usersService.marcarComunidadPopupVisto(req.user.userId);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const [user, extra] = await Promise.all([
      this.usersService.getUserById(req.user.userId),
      this.usersService.getPerfilExtra(req.user.userId),
    ]);
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
      ...extra,
      ...flagsLibres,
      acceso_libre: accesoLibre,
      admin_email: adminEmail,
      is_admin: adminEmail && req.user?.admin === true,
    };
  }

  // Verifica la contraseña de administración. Si el email está en ADMIN_EMAILS y
  // la contraseña (ADMIN_PASSWORD) es correcta, devuelve un token NUEVO con el
  // permiso de admin activado. Sin este token, el AdminGuard rechaza todo.
  // La llave del panel entero: sin límite, se puede probar ADMIN_PASSWORD a
  // ciegas hasta acertar.
  @Post("admin/verify")
  @Throttle(LIMITE_AUTH)
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

  // Abre o cierra UNA disciplina suelta (o las ocho con 'all'). No arrastra a las
  // anteriores: el recorrido no lleva orden obligatorio, así que se puede regalar
  // solo Cábala sin regalar astrología.
  @Post("admin/acceso")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async concederAcceso(
    @Body() body: { userId?: string; disciplina?: DisciplinaKey | 'all'; abierta?: boolean },
  ) {
    if (!body?.userId) throw new BadRequestException('userId requerido');
    const disciplina = body.disciplina ?? 'all';
    if (disciplina !== 'all' && !DISCIPLINAS_ORDEN.includes(disciplina)) {
      throw new BadRequestException('Disciplina desconocida');
    }
    return await this.usersService.concederAcceso(body.userId, disciplina, body.abierta !== false);
  }

  @Post("admin/acceso/revocar")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async revocarAcceso(@Body() body: { userId?: string }) {
    if (!body?.userId) throw new BadRequestException('userId requerido');
    return await this.usersService.revocarAcceso(body.userId);
  }

  // ── ENTRAR COMO otra persona ─────────────────────────────────────────────
  // Devuelve un token de ESA cuenta, para poder ver la web exactamente como la
  // ve ella: sus disciplinas, por dónde va, lo que ha escrito. No es un modo de
  // lectura aparte (eso obligaría a duplicar cada página): es su sesión de
  // verdad, así que lo que se escriba aquí se guarda en su recorrido.
  //
  // Tres cosas lo mantienen a raya:
  //   · Exige token de admin DESBLOQUEADO (email en ADMIN_EMAILS + contraseña).
  //   · El token que sale NO es de admin (`admin: false`), así que desde dentro
  //     de la cuenta no se puede volver a tocar el panel ni suplantar en cadena.
  //   · Lleva el claim `sup` con el id de quien está mirando y caduca en 12h,
  //     no en 30 días como una sesión normal.
  @Post("admin/suplantar")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async suplantar(@Req() req: any, @Body() body: { userId?: string }) {
    if (!body?.userId?.trim()) throw new BadRequestException('userId requerido');

    const user: any = await this.usersService.getUserById(body.userId.trim());
    if (!user?.id) throw new BadRequestException('Esa cuenta no existe');

    // Queda en el registro del servidor: entrar en la cuenta de alguien no
    // debería poder hacerse sin dejar rastro.
    console.log(
      `[suplantacion] ${req.user?.email} entra como ${user.email} (${user.id}) — ${new Date().toISOString()}`,
    );

    const token = this.authService.generateToken(user.id, user.email, false, {
      suplantadoPor: req.user.userId,
      duracionSegundos: 12 * 60 * 60, // 12 horas
    });
    return { token, user: { id: user.id, name: user.name, email: user.email, img: user.img ?? null } };
  }

  // Borrar una cuenta entera desde el panel (irreversible: se va la cuenta y
  // todos sus datos de recorrido, notas y reservas). Va aquí arriba, antes de
  // @Delete(":id"), que es el borrado de la propia cuenta y pide contraseña.
  @Delete("admin/usuario/:id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async borrarCuenta(@Param("id") id: string, @Req() req: any) {
    if (!id?.trim()) throw new BadRequestException('id requerido');
    return await this.usersService.deleteUserComoAdmin(id, req.user?.userId);
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
  async remove(@Param("id") id: string, @Body() body: { password?: string }, @Req() req: any) {
    // Desde una sesión prestada (admin «entrando como») no se borra la cuenta:
    // es lo único de aquí que no tiene vuelta atrás. Para eso está
    // DELETE /user/admin/usuario/:id, que se hace a cara descubierta.
    if (req.user?.suplantadoPor) {
      throw new ForbiddenException('No se puede borrar la cuenta desde una sesión de administración');
    }
    return await this.usersService.deleteUser(id, body?.password);
  }

}
