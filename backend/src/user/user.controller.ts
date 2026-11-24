import { esIdLectura } from '../lectura/lectura-id';
import { BadRequestException, Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Req, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService, DISCIPLINAS_ORDEN } from './user.service';
import type { DisciplinaKey } from './user.service';
import type { CreateUser, LoginUser, UpdateUser } from "../dtos/user.types";
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { AuthService } from '../auth/auth.service';
import { Throttle } from '@nestjs/throttler';
import { getAdminEmails, isAdminEmail, isAccesoLibreEmail, isAntiguaEmail, verifyAdminPassword } from '../auth/admin.util';
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

  // Entrar con el enlace del correo de «tu carta ya está lista» (cuentas solo carta, sin contraseña).
  @Post("lectura/entrar")
  @Throttle(LIMITE_AUTH)
  @HttpCode(HttpStatus.OK)
  async entrarLectura(@Body() body: { token?: string }) {
    return await this.usersService.entrarConEnlaceLectura(body?.token ?? "");
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
    // La sesión de admin no es una cuenta de la base de datos (ver admin/entrar):
    // no hay fila que leer, solo lo que dice su token.
    if (req.user?.userId === 'admin' && isAdminEmail(req.user?.email)) {
      return {
        id: 'admin',
        name: 'Admin',
        email: req.user.email,
        admin_email: true,
        is_admin: req.user.admin === true,
      };
    }
    // La persona de LECTURA no es una cuenta (vive en `lectura_cliente`): solo se dice quién es y que tiene Astrología.
    if (esIdLectura(req.user?.userId)) {
      const c = await this.usersService.getClienteLectura(req.user.userId);
      return {
        ...(c ? this.usersService.perfilDeLectura(c) : { id: req.user.userId, name: '', email: req.user?.email, img: null, solo_lectura: true, metodo_suscrito: true }),
        en_sesiones: false,
        admin_email: false,
        is_admin: false,
      };
    }
    const [user, extra, premium] = await Promise.all([
      this.usersService.getUserById(req.user.userId),
      this.usersService.getPerfilExtra(req.user.userId),
      this.usersService.getPremium(req.user.userId),
    ]);
    const email = (user as any)?.email ?? req.user?.email;
    // `admin_email`: el email está en ADMIN_EMAILS (puede pedir la contraseña).
    // `is_admin`: además está DESBLOQUEADO (token emitido tras la contraseña).
    const adminEmail = isAdminEmail(email);

    // Acceso libre: cuentas invitadas (ACCESO_LIBRE_EMAILS) que ven todo el
    // recorrido sin pagar. No se toca la BD, se abre al vuelo en cada respuesta,
    // así que basta con quitar el email de la variable para cerrarlo de nuevo.
    const accesoLibre = isAccesoLibreEmail(email);
    // TODAS LAS DISCIPLINAS ABIERTAS (nov-2026): no hay que pagar ni esperar a que María abra nada, todas las
    // cuentas ven las ocho. La excepción es la cuenta «solo carta» (pidió únicamente su lectura): esa sigue sin
    // acceso al resto. Para volver a cerrar: poner DISCIPLINAS_ABIERTAS a false (vuelve a mandar la BD y el acceso libre).
    const DISCIPLINAS_ABIERTAS = true;
    const abiertas = accesoLibre || (DISCIPLINAS_ABIERTAS && (extra as any)?.solo_lectura !== true);
    const flagsLibres = abiertas
      ? Object.fromEntries(DISCIPLINAS_ORDEN.map((k) => [`${k}_suscrito`, true]))
      // Cuenta «solo carta»: tiene abierta ASTROLOGÍA (su carta y todo su recorrido), y solo esa.
      : (extra as any)?.solo_lectura === true ? { metodo_suscrito: true } : {};

    return {
      ...user,
      ...extra,
      ...flagsLibres,
      // Contenido premium: pagado, o cuenta de acceso libre.
      premium_suscrito: premium.activo || accesoLibre,
      premium_hasta: premium.hasta,
      premium_avisos_elegidos: premium.avisosElegidos,
      premium_aviso_email: premium.avisoEmail,
      premium_aviso_whatsapp: premium.avisoWhatsapp,
      acceso_libre: accesoLibre,
      // Puede entrar en la web antigua (/antigua/*).
      antigua_email: isAntiguaEmail(email),
      // Cuenta SOLO de Premium: ha tenido el mes pagado y no es asesorada (ni «en
      // sesiones», ni con disciplinas, ni admin, ni acceso libre). Esa cuenta solo ve
      // Podcasts y Reels; la asesorada, el recorrido.
      solo_premium: !!premium.hasta && !accesoLibre && !adminEmail
        && (user as any)?.en_sesiones !== true
        && !DISCIPLINAS_ORDEN.some((k) => (user as any)?.[`${k}_suscrito`] === true),
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

  // Entrada propia de administración (/admin/login): email de ADMIN_EMAILS (o la
  // palabra «admin») + contraseña de admin. La admin NO es una cuenta de la base
  // de datos: no se busca ni se comprueba que exista, solo que las credenciales
  // sean válidas. Su sesión lleva un id propio («admin»). Mismo error para todo,
  // para no revelar qué falló.
  @Post("admin/entrar")
  @Throttle(LIMITE_AUTH)
  @HttpCode(HttpStatus.OK)
  async entrarAdmin(@Body() body: { name?: string; password?: string }) {
    const escrito = (body?.name ?? '').trim().toLowerCase();
    const emails = getAdminEmails();
    const email = escrito === 'admin' ? emails[0] : emails.find((e) => e === escrito);
    if (!email || !verifyAdminPassword(body?.password)) {
      throw new ForbiddenException('Credenciales de administración incorrectas');
    }
    const token = this.authService.generateToken('admin', email, true);
    return { token, user: { id: 'admin', name: 'Admin' } };
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

  // ── Cuentas de asesoría: las crea la admin ───────────────────────────────
  // «Estoy siendo asesorado» no tiene registro: María da de alta a la persona Y LE PONE LA CONTRASEÑA. Luego le manda un
  // correo (que escribe ella, con el usuario y la contraseña) desde `admin/usuario/:id/correo`; la cuenta se activa
  // cuando la persona entra la primera vez. No tiene nada abierto hasta que se lo abra desde la ficha (`admin/acceso`).
  @Post("admin/crear")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async crearCuentaAsesorada(
    @Body() body: { name?: string; email?: string; password?: string; telefono?: string; fecha_nacimiento?: string },
  ) {
    return await this.usersService.crearCuentaAsesorada(body);
  }

  // El correo de acceso de una cuenta real, con el texto que escribe María (y, si viene, la contraseña nueva de la cuenta).
  @Post("admin/usuario/:id/correo")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async enviarCorreoCuenta(
    @Param("id") id: string,
    @Body() body: { asunto?: string; texto?: string; contrasena?: string },
  ) {
    if (!id?.trim()) throw new BadRequestException('id requerido');
    return await this.usersService.enviarCorreoCuenta(id, body ?? {});
  }

  // Marca (o desmarca) que esa persona está haciendo sesiones: es lo que hace
  // salir el botón «Diario de terapias» en la tabla de /admin/usuarios.
  @Post("admin/sesiones")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async marcarEnSesiones(@Body() body: { userId?: string; enSesiones?: boolean }) {
    if (!body?.userId) throw new BadRequestException('userId requerido');
    return await this.usersService.setEnSesiones(body.userId, body.enSesiones === true);
  }

  // ── El camino de una persona, visto por María ────────────────────────────
  // Datos básicos de la persona (nombre y foto) para pintar la barra y el header
  // cuando María abre su camino. NO da ningún token: María sigue con el suyo y el
  // navegador manda `X-Persona` (ver auth/persona.util.ts). Va antes de
  // @Get(":id"). Queda en el registro del servidor.
  @Get("admin/persona/:id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async persona(@Req() req: any, @Param("id") id: string) {
    const user: any = await this.usersService.getUserById(id?.trim());
    if (!user?.id) throw new BadRequestException('Esa cuenta no existe');
    console.log(
      `[persona] ${req.user?.email} abre el camino de ${user.email} (${user.id}) — ${new Date().toISOString()}`,
    );
    // `solo_lectura`: para que María vea el camino de esa cuenta tal como lo ve la persona (sin foto, sin «Mi cuenta», sin menú).
    const extra: any = esIdLectura(user.id) ? { solo_lectura: true } : await this.usersService.getPerfilExtra(user.id);
    return { user: { id: user.id, name: user.name, email: user.email, img: user.img ?? null, solo_lectura: extra?.solo_lectura === true } };
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
  async update(@Param("id") id: string, @Body() body: UpdateUser, @Req() req: any) {
    // La admin (desbloqueada) edita los datos de cualquiera; la persona asesorada no los suyos.
    const esAdmin = req.user?.admin === true && isAdminEmail(req.user?.email);
    return await this.usersService.updateUser(id, body, esAdmin);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnerGuard)
  async remove(@Param("id") id: string, @Body() body: { password?: string }, @Req() req: any) {
    // Desde el camino de María en el de una persona no se borra la cuenta:
    // es lo único de aquí que no tiene vuelta atrás. Para eso está
    // DELETE /user/admin/usuario/:id, que se hace a cara descubierta.
    if (req.user?.suplantadoPor) {
      throw new ForbiddenException('No se puede borrar la cuenta desde una sesión de administración');
    }
    return await this.usersService.deleteUser(id, body?.password);
  }

}
