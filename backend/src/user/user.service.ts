import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database.service';
import { randomString } from 'src/Global';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginUser, UpdateUser } from '../dtos/user.types';
import { MailService } from '../mail/mail.service';
import {
  crearTokenRecuperacion,
  leerUserIdDeToken,
  tokenRecuperacionValido,
} from '../auth/password-reset.util';
import { isAdminEmail } from '../auth/admin.util';


/** Las ocho disciplinas de «El Recorrido», en el orden en que se desbloquean. */
export const DISCIPLINAS_ORDEN = [
  'metodo', 'psicologia', 'ayurveda', 'tcm',
  'fisiologia', 'nutricion', 'cabala', 'cultura',
] as const;
export type DisciplinaKey = (typeof DISCIPLINAS_ORDEN)[number];


async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Deja el trato en 'el' | 'ella' o en null. Cualquier otra cosa se descarta en
 * vez de guardarse: la columna lleva un check y un valor raro reventaría el
 * insert entero (y con él el registro de la cuenta).
 */
function saneaTrato(valor: unknown): 'el' | 'ella' | null {
  return valor === 'el' || valor === 'ella' ? valor : null;
}


@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  // --------- Verifica si el nombre o email existen ---------
  async getNomEmailExist(nom: string, email: string): Promise<{ nameExists: boolean; emailExists: boolean }> {
    const db = this.databaseService.getClient();
    // Dos consultas con .eq() parametrizado (el cliente las escapa) en lugar de
    // interpolar la entrada del usuario en un filtro .or() de PostgREST.
    const [byName, byEmail] = await Promise.all([
      db.from('user').select('name').eq('name', nom).limit(1),
      db.from('user').select('email').eq('email', email).limit(1),
    ]);
    return {
      nameExists: (byName.data ?? []).length > 0,
      emailExists: (byEmail.data ?? []).length > 0,
    };
  }

  // --------- Crear usuario ---------
  async createUser(data: CreateUser) {
    try {
      const { nameExists, emailExists } = await this.getNomEmailExist(data.name, data.email);
      if (nameExists) throw new ConflictException('El nombre ya existe. Elige otro');
      if (emailExists) throw new ConflictException('El email ya está registrado');

      let id = randomString();
      const pass = await hashPassword(data.password);

      // Si la columna `trato` todavía no está creada (sql/user-trato.sql sin
      // ejecutar), se inserta sin ella: crear la cuenta es más importante que
      // guardar la preferencia, y sin este respaldo el registro entero fallaría.
      let conTrato = true;

      // Reintentamos solo ante colisión de id (23505), con un tope para no
      // entrar en bucle infinito si el insert nunca devuelve la fila esperada.
      for (let intento = 0; intento < 5; intento++) {
        try {
          const fila: Record<string, unknown> = { id, name: data.name, email: data.email, password: pass };
          if (conTrato) fila.trato = saneaTrato(data.trato);

          // El select va con cadena literal en cada rama (el cliente de Supabase
          // tipa la respuesta a partir de ese texto y no admite un ternario).
          const insercion = this.databaseService.getClient().from('user').insert(fila);
          const { data: rows, error } = conTrato
            ? await insercion.select('id, name, email, img, trato')
            : await insercion.select('id, name, email, img');

          if (error) throw error;

          if (rows && rows.length === 1) {
            const newUser = rows[0];
            const token = this.authService.generateToken(newUser.id, data.email);
            // Correo de bienvenida con el enlace de /logIn guardado. No se espera
            // ni se deja que reviente el registro: la cuenta ya existe y la
            // persona ya está dentro, así que un fallo del SMTP no puede
            // devolverle un error como si no se hubiera registrado.
            this.enviarBienvenidaSinBloquear(newUser.email, newUser.name);
            return { token, user: newUser };
          }
          // Insert sin error pero sin fila: no reintentamos a ciegas.
          throw new Error('El insert de usuario no devolvió la fila esperada');
        } catch (error: any) {
          if (error.code === '23505') {
            id = randomString();
            continue;
          }
          // Falta la columna `trato`: repetimos sin ella (una sola vez).
          if (conTrato && /trato/i.test(String(error?.message ?? ''))) {
            console.warn(
              '[createUser] la columna "trato" no existe: ejecuta backend/sql/user-trato.sql. Creo la cuenta sin ella.',
            );
            conTrato = false;
            continue;
          }
          throw error;
        }
      }

      throw new ConflictException('No se pudo generar un id de usuario único');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Manda la bienvenida en segundo plano. Va aparte (y sin `await`) porque el
   * envío tarda un par de segundos contra el SMTP de Gmail y no tiene por qué
   * retrasar la respuesta del registro.
   */
  private enviarBienvenidaSinBloquear(email: string, nombre: string, conGoogle = false) {
    void this.mailService
      .enviarBienvenidaCuenta(email, nombre ?? '', { conGoogle })
      .catch((err) => console.error('[createUser] no se pudo enviar la bienvenida:', err));
  }

  // --------- Login ---------
  async logIn(body: LoginUser) {
    try {
      const db = this.databaseService.getClient();
      // Buscar por nombre y, si no hay, por email (con .eq() parametrizado en
      // lugar de interpolar la entrada en un filtro .or()).
      let { data: rows } = await db.from('user').select('*').eq('name', body.name).limit(1);
      if (!rows || rows.length === 0) {
        ({ data: rows } = await db.from('user').select('*').eq('email', body.name).limit(1));
      }

      if (rows && rows.length > 0) {
        const user = rows[0];
        const coinciden = await comparePassword(body.password, user.password);
        if (coinciden) {
          const token = this.authService.generateToken(user.id, user.email);
          // No devolver nunca el hash de la contraseña al cliente.
          const { password, ...safeUser } = user;
          return { token, user: safeUser };
        } else {
          throw new ConflictException('La contraseña es errónea');
        }
      } else {
        throw new ConflictException('Nombre o email no existen');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // RECUPERACIÓN DE CONTRASEÑA
  //
  // Sin esto, quien se registraba con email y contraseña y la olvidaba perdía
  // para siempre el acceso a un recorrido que había pagado (solo se salvaban las
  // cuentas de Google). El token va firmado, no guardado: ver
  // `auth/password-reset.util.ts` para el porqué.
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Envía el email de recuperación si el email existe. No devuelve nunca si la
   * cuenta existe o no: contestar distinto convertiría este endpoint en un
   * comprobador de «¿está esta persona registrada aquí?».
   */
  async solicitarRecuperacion(email: string): Promise<void> {
    const limpio = (email ?? '').trim().toLowerCase();
    if (!limpio) return;

    const { data: rows } = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, password')
      .eq('email', limpio)
      .limit(1);

    const user = rows?.[0] as { id: string; name: string; email: string; password: string } | undefined;
    if (!user?.password) return; // cuenta inexistente o sin contraseña utilizable

    const token = crearTokenRecuperacion(user.id, user.password);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const enlace = `${frontendUrl}/recuperar?token=${encodeURIComponent(token)}`;

    await this.mailService.enviarRecuperacionPassword(user.email, user.name ?? '', enlace);
  }

  /** Cambia la contraseña si el token es válido. El token queda inservible al hacerlo. */
  async restablecerPassword(token: string, nuevaPassword: string) {
    const pass = (nuevaPassword ?? '').trim();
    if (pass.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    const userId = leerUserIdDeToken(token);
    if (!userId) throw new BadRequestException('El enlace no es válido');

    const { data: rows } = await this.databaseService.getClient()
      .from('user')
      .select('id, password')
      .eq('id', userId)
      .limit(1);

    const user = rows?.[0] as { id: string; password: string } | undefined;
    if (!user?.password || !tokenRecuperacionValido(token, user.password)) {
      throw new BadRequestException('El enlace ha caducado o ya se ha usado');
    }

    const { error } = await this.databaseService.getClient()
      .from('user')
      .update({ password: await hashPassword(pass) })
      .eq('id', user.id);
    if (error) throw error;

    return { ok: true as const };
  }

  // --------- Obtener todos los usuarios ---------
  async getUser() {
    const { data } = await this.databaseService.getClient()
      .from('user')
      .select('*');
    return data;
  }

  // --------- Usuarios que se han unido al recorrido (para el panel admin) ---------
  async getRecorridoUsers() {
    const client = this.databaseService.getClient();
    // Intento con filtro por metodo_suscrito; si la columna no existe, devolvemos todos.
    const full = await client
      .from('user')
      .select('id, name, email, img, metodo_suscrito')
      .eq('metodo_suscrito', true)
      .order('name', { ascending: true });
    if (!full.error) return full.data ?? [];

    const { data } = await client
      .from('user')
      .select('id, name, email, img')
      .order('name', { ascending: true });
    return data ?? [];
  }

  // --------- TODOS los usuarios, con sus disciplinas (panel de accesos) ---------
  // A diferencia de getRecorridoUsers (que solo lista a quien ya entró en el
  // recorrido), aquí hacen falta TODAS las cuentas: para regalar el acceso a
  // alguien que todavía no ha pagado nada hay que poder encontrarlo.
  // El buscador del panel filtra en el cliente, así que aquí basta con devolver
  // la lista completa ordenada (tope de 500 para no traer nunca una respuesta
  // enorme; si algún día se pasa de ahí, habrá que buscar en servidor).
  async getTodosUsuarios() {
    const client = this.databaseService.getClient();
    const flags = DISCIPLINAS_ORDEN.map((k) => `${k}_suscrito`).join(', ');

    const consulta = (select: string) =>
      client.from('user').select(select).order('name', { ascending: true }).limit(500);

    // Si alguna columna *_suscrito aún no existe, caemos a los datos básicos.
    const full = await consulta(`id, name, email, img, ${flags}`);
    if (!full.error) return full.data ?? [];

    const { data } = await consulta('id, name, email, img');
    return data ?? [];
  }

  // --------- Abrir o cerrar acceso a una cuenta (panel admin) ---------
  // Marca las disciplinas como suscritas SIN pasar por Stripe. Solo lo puede
  // llamar el controlador tras JwtAuthGuard + AdminGuard, así que no es una vía
  // para que un usuario se desbloquee a sí mismo.
  //
  // Cada disciplina va SUELTA: abrir una NO arrastra a las anteriores, porque el
  // recorrido no obliga a un orden (se puede empezar por donde se quiera). Con
  // 'all' se abren —o se cierran— las ocho de golpe.
  async concederAcceso(id: string, disciplina: DisciplinaKey | 'all' = 'all', abierta = true) {
    if (disciplina !== 'all' && !DISCIPLINAS_ORDEN.includes(disciplina)) {
      throw new ConflictException('Disciplina desconocida');
    }

    await this.getUserById(id); // 404 si la cuenta no existe
    const claves = disciplina === 'all' ? DISCIPLINAS_ORDEN : [disciplina];
    for (const key of claves) {
      await this.setSuscripcion(id, key, abierta);
    }
    return await this.getUserById(id);
  }

  // --------- Quitar el acceso concedido (panel admin) ---------
  // Cierra TODAS las disciplinas de esa cuenta. Se usa para retirar un acceso
  // regalado; ojo, si la persona había pagado de verdad también se lo quita.
  async revocarAcceso(id: string) {
    await this.getUserById(id);
    for (const key of DISCIPLINAS_ORDEN) {
      await this.setSuscripcion(id, key, false);
    }
    return await this.getUserById(id);
  }

  // Abre o cierra UNA disciplina. Va columna a columna (no en un único update)
  // para que, si alguna *_suscrito todavía no está migrada, solo se pierda esa y
  // no el resto — el mismo criterio que los marcarSuscrito*.
  private async setSuscripcion(id: string, key: DisciplinaKey, abierta: boolean) {
    const { error } = await this.databaseService.getClient()
      .from('user')
      .update({
        [`${key}_suscrito`]: abierta,
        [`${key}_fecha_compra`]: abierta ? new Date().toISOString() : null,
      })
      .eq('id', id);
    if (error) {
      console.warn(`[user.service] setSuscripcion ${key}=${abierta} falló (¿columnas no creadas?):`, error.message);
    }
  }

  // --------- Obtener usuario por ID ---------
  async getUserById(id: string) {
    // Intento 1: con las columnas de todas las disciplinas (cabala_*/nutricion_*/
    // fisiologia_* pueden no existir todavía si está pendiente el ALTER TABLE →
    // caemos a los intentos siguientes).
    const full = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, trato, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra, ayurveda_suscrito, ayurveda_fecha_compra, tcm_suscrito, tcm_fecha_compra, fisiologia_suscrito, fisiologia_fecha_compra, nutricion_suscrito, nutricion_fecha_compra, cabala_suscrito, cabala_fecha_compra, cultura_suscrito, cultura_fecha_compra')
      .eq('id', id)
      .single();
    if (full.data) return full.data;

    // Intento 1-: sin cultura_* (por si aún no se ha migrado esa columna) para no
    // perder el resto de flags que sí existen.
    const conCabala = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra, ayurveda_suscrito, ayurveda_fecha_compra, tcm_suscrito, tcm_fecha_compra, fisiologia_suscrito, fisiologia_fecha_compra, nutricion_suscrito, nutricion_fecha_compra, cabala_suscrito, cabala_fecha_compra')
      .eq('id', id)
      .single();
    if (conCabala.data) return conCabala.data;

    // Intento 1·: sin cabala_* (por si aún no se ha migrado esa columna) para no
    // perder el resto de flags que sí existen.
    const conNutricion = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra, ayurveda_suscrito, ayurveda_fecha_compra, tcm_suscrito, tcm_fecha_compra, fisiologia_suscrito, fisiologia_fecha_compra, nutricion_suscrito, nutricion_fecha_compra')
      .eq('id', id)
      .single();
    if (conNutricion.data) return conNutricion.data;

    // Intento 1a: sin nutricion_* (por si aún no se ha migrado esa columna) para no
    // perder el resto de flags que sí existen.
    const conFisio = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra, ayurveda_suscrito, ayurveda_fecha_compra, tcm_suscrito, tcm_fecha_compra, fisiologia_suscrito, fisiologia_fecha_compra')
      .eq('id', id)
      .single();
    if (conFisio.data) return conFisio.data;

    // Intento 1b: sin fisiologia_* (por si aún no se ha migrado esa columna) para no
    // perder el resto de flags que sí existen.
    const conTcm = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra, ayurveda_suscrito, ayurveda_fecha_compra, tcm_suscrito, tcm_fecha_compra')
      .eq('id', id)
      .single();
    if (conTcm.data) return conTcm.data;

    // Intento 2: sin ayurveda_* (por si aún no se ha migrado esa columna) para no
    // perder los flags de metodo/psicologia que sí existen.
    const conPsico = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra')
      .eq('id', id)
      .single();
    if (conPsico.data) return conPsico.data;

    // Fallback final si las columnas de suscripción aún no existen.
    const { data, error } = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img')
      .eq('id', id)
      .single();
    if (error || !data) throw new NotFoundException('Usuario no encontrado');
    return data;
  }

  // --------- Actualizar usuario ---------
  async updateUser(id: string, body: UpdateUser) {
    const updates: Record<string, string | null> = {};
    if (body.name) updates.name = body.name;
    if (body.email) updates.email = body.email;
    if (body.password) updates.password = await hashPassword(body.password);
    // `trato`: se acepta también el null (quitar la preferencia), así que se
    // mira si viene la clave, no si el valor es «truthy».
    if ('trato' in body) updates.trato = saneaTrato(body.trato);

    const { data, error } = await this.databaseService.getClient()
      .from('user')
      .update(updates)
      .eq('id', id)
      .select('id, name, email, img')
      .single();

    if (error) throw error;
    return data;
  }

  // --------- Login con Google (encontrar o crear) ---------
  async findOrCreateGoogleUser({ email, name, img }: { email: string; name: string; img: string | null }) {
    // Buscar usuario existente por email (sin traer el hash de contraseña)
    const { data: existing } = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img')
      .eq('email', email);

    if (existing && existing.length > 0) {
      const user = existing[0];
      const token = this.authService.generateToken(user.id, user.email);
      return { token, user };
    }

    // Crear nuevo usuario — manejar conflicto de nombre
    let finalName = name;
    const { data: nameCheck } = await this.databaseService.getClient()
      .from('user')
      .select('id')
      .eq('name', finalName);
    if ((nameCheck?.length ?? 0) > 0) {
      finalName = `${name}_g`;
    }

    // Contraseña aleatoria (el usuario de Google nunca la usará)
    const dummyPass = await hashPassword(randomString());

    let id = randomString();

    // Reintento acotado solo ante colisión de id (23505).
    for (let intento = 0; intento < 5; intento++) {
      try {
        const { data: rows, error } = await this.databaseService.getClient()
          .from('user')
          .insert({ id, name: finalName, email, password: dummyPass, img: img ?? null })
          .select('id, name, email, img');

        if (error) throw error;

        if (rows && rows.length === 1) {
          const token = this.authService.generateToken(rows[0].id, rows[0].email);
          // Cuenta nueva (arriba se ha devuelto ya si existía), así que también
          // le llega su enlace de acceso guardado.
          this.enviarBienvenidaSinBloquear(rows[0].email, rows[0].name, true);
          return { token, user: rows[0] };
        }
        throw new Error('El insert de usuario (Google) no devolvió la fila esperada');
      } catch (error: any) {
        if (error.code === '23505') {
          id = randomString();
          continue;
        }
        throw error;
      }
    }

    throw new ConflictException('No se pudo generar un id de usuario único');
  }

  // --------- Marcar usuario como suscrito al Método ---------
  async marcarSuscritoMetodo(id: string) {
    // Intenta persistir el estado en BD. Si las columnas metodo_* aún no existen
    // (ALTER TABLE pendiente), no rompe el flujo: solo envía el email y devuelve
    // los datos básicos del usuario.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        metodo_suscrito: true,
        metodo_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update metodo_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      // Fallback: leer datos básicos del usuario para poder enviar email igualmente.
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Psicología (2ª disciplina) ---------
  async marcarSuscritoPsicologia(id: string) {
    // Mismo patrón que marcarSuscritoMetodo: si las columnas psicologia_* aún no
    // existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        psicologia_suscrito: true,
        psicologia_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update psicologia_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Ayurveda (3ª disciplina) ---------
  async marcarSuscritoAyurveda(id: string) {
    // Mismo patrón que marcarSuscritoPsicologia: si las columnas ayurveda_* aún
    // no existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        ayurveda_suscrito: true,
        ayurveda_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update ayurveda_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Medicina China (4ª disciplina) ---------
  async marcarSuscritoTcm(id: string) {
    // Mismo patrón que marcarSuscritoAyurveda: si las columnas tcm_* aún no
    // existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        tcm_suscrito: true,
        tcm_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update tcm_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Fisiología (5ª disciplina) ---------
  async marcarSuscritoFisiologia(id: string) {
    // Mismo patrón que marcarSuscritoTcm: si las columnas fisiologia_* aún no
    // existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        fisiologia_suscrito: true,
        fisiologia_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update fisiologia_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Nutrición (6ª disciplina) ---------
  async marcarSuscritoNutricion(id: string) {
    // Mismo patrón que marcarSuscritoFisiologia: si las columnas nutricion_* aún
    // no existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        nutricion_suscrito: true,
        nutricion_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update nutricion_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Cábala (7ª disciplina) ---------
  async marcarSuscritoCabala(id: string) {
    // Mismo patrón que marcarSuscritoNutricion: si las columnas cabala_* aún no
    // existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        cabala_suscrito: true,
        cabala_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update cabala_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Marcar usuario como suscrito a Cultura (8ª disciplina) ---------
  async marcarSuscritoCultura(id: string) {
    // Mismo patrón que marcarSuscritoCabala: si las columnas cultura_* aún no
    // existen (ALTER TABLE pendiente), no rompe el flujo.
    const tryUpdate = await this.databaseService.getClient()
      .from('user')
      .update({
        cultura_suscrito: true,
        cultura_fecha_compra: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, email')
      .single();

    if (tryUpdate.error) {
      console.warn('[user.service] update cultura_* falló (¿columnas no creadas?):', tryUpdate.error.message);
      const { data, error } = await this.databaseService.getClient()
        .from('user')
        .select('id, name, email')
        .eq('id', id)
        .single();
      if (error || !data) throw new NotFoundException('Usuario no encontrado');
      return data;
    }

    if (!tryUpdate.data) throw new NotFoundException('Usuario no encontrado');
    return tryUpdate.data;
  }

  // --------- Eliminar usuario ---------
  // Borra la cuenta y TODOS los datos relacionados con ese usuario:
  // sus filas en cada tabla de disciplina/recorrido, sus reservas de llamada
  // y su foto de perfil en el bucket de storage. La fila de `user` se borra al
  // final. Cada borrado es best-effort: si una tabla falla, se registra el
  // error pero se continúa con las demás para no dejar datos huérfanos.
  async deleteUser(id: string, password?: string) {
    const user = await this.leerCuentaParaBorrar(id);

    // Confirmación de seguridad: para eliminar la cuenta hay que introducir la
    // contraseña correcta (además de escribir «BORRAR» en el cliente).
    if (!password?.trim()) {
      throw new ConflictException('Debes introducir tu contraseña para eliminar la cuenta');
    }
    const coincide = user.password ? await comparePassword(password, user.password) : false;
    if (!coincide) {
      throw new ConflictException('La contraseña es errónea');
    }

    return await this.borrarCuentaYDatos(id, user);
  }

  // --------- Eliminar usuario DESDE EL PANEL DE ADMIN ---------
  /**
   * Borra la cuenta de otra persona desde /admin/accesos. Aquí no se pide
   * contraseña porque quien borra no es la dueña de la cuenta, así que el
   * permiso lo da el `AdminGuard` (email en ADMIN_EMAILS + contraseña de
   * administración ya verificada). Dos cerrojos, porque esto no tiene vuelta:
   *  · no puedes borrarte a ti misma desde el panel (eso va en «Mi cuenta»);
   *  · no se puede borrar una cuenta de administración, o un despiste te deja
   *    sin panel para siempre.
   */
  async deleteUserComoAdmin(id: string, adminUserId: string) {
    if (id === adminUserId) {
      throw new ConflictException(
        'No puedes borrar tu propia cuenta desde el panel: hazlo desde «Mi cuenta».',
      );
    }
    const user = await this.leerCuentaParaBorrar(id);
    if (isAdminEmail(user.email)) {
      throw new ConflictException(
        'Esa cuenta es de administración: sácala de ADMIN_EMAILS antes de borrarla.',
      );
    }
    return await this.borrarCuentaYDatos(id, user);
  }

  /**
   * Lee email, foto y hash de contraseña ANTES de borrar la fila de usuario:
   * algunas tablas (bookings) se relacionan por email, la foto vive en storage
   * y el hash hace falta para confirmar la identidad cuando borra la dueña.
   */
  private async leerCuentaParaBorrar(id: string) {
    const db = this.databaseService.getClient();
    const { data: userRows } = await db
      .from('user')
      .select('email, img, password')
      .eq('id', id);
    const user = userRows?.[0] as { email?: string; img?: string; password?: string } | undefined;
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  /** Borrado real: datos de todas las tablas, reservas, foto y la fila `user`. */
  private async borrarCuentaYDatos(
    id: string,
    user: { email?: string; img?: string },
  ) {
    const db = this.databaseService.getClient();

    // Tablas con datos del usuario, cada una con su columna identificadora.
    // (Los nombres de columna difieren entre tablas: user_id, userId, userid, idUser…)
    const relatedTables: { table: string; column: string }[] = [
      { table: 'metodo_psicologia', column: 'user_id' },
      { table: 'psicologia_des', column: 'user_id' },
      { table: 'metodo_astrologia', column: 'user_id' },
      { table: 'metodo_ayurveda', column: 'user_id' },
      { table: 'metodo_tcm', column: 'user_id' },
      { table: 'metodo_fisiologia', column: 'user_id' },
      { table: 'metodo_nutricion', column: 'user_id' },
      { table: 'metodo_cabala', column: 'user_id' },
      { table: 'notas', column: 'user_id' },
      { table: 'recorrido_progreso', column: 'user_id' },
      { table: 'astrologia', column: 'userId' },
      { table: 'ayurveda', column: 'userId' },
      { table: 'ayurveda_respuestas', column: 'user_id' },
      { table: 'nutricion', column: 'userId' },
      { table: 'tcm', column: 'userId' },
      { table: 'tcm_respuestas', column: 'user_id' },
      { table: 'cabala', column: 'idUser' },
      { table: 'fitoterapia', column: 'idUser' },
      { table: 'neuroPsicologia', column: 'userid' },
    ];

    for (const { table, column } of relatedTables) {
      const { error } = await db.from(table).delete().eq(column, id);
      if (error) {
        console.error(`[deleteUser] Error borrando de "${table}" (${column}=${id}):`, error.message);
      }
    }

    // Reservas de llamada: se relacionan por email, no por id de usuario.
    if (user?.email) {
      const { error } = await db.from('bookings').delete().eq('email', user.email);
      if (error) console.error('[deleteUser] Error borrando bookings:', error.message);
    }

    // Foto de perfil en el bucket 'img' (si tiene una subida).
    if (user?.img) {
      // La ruta dentro del bucket es lo que va tras '/public/img/'.
      const path = user.img.split('?')[0].split('/public/img/')[1];
      if (path) {
        const { error } = await db.storage.from('img').remove([path]);
        if (error) console.error('[deleteUser] Error borrando foto de perfil:', error.message);
      }
    }

    // Por último, la propia cuenta.
    const { error } = await db.from('user').delete().eq('id', id);
    if (error) throw error;

    return { message: 'Cuenta y datos relacionados eliminados' };
  }
}
