import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database.service';
import { randomString } from 'src/Global';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginUser, UpdateUser } from '../dtos/user.types';


async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}


@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService, private readonly databaseService: DatabaseService) {}

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

      // Reintentamos solo ante colisión de id (23505), con un tope para no
      // entrar en bucle infinito si el insert nunca devuelve la fila esperada.
      for (let intento = 0; intento < 5; intento++) {
        try {
          const { data: rows, error } = await this.databaseService.getClient()
            .from('user')
            .insert({ id, name: data.name, email: data.email, password: pass })
            .select('id, name, email, img');

          if (error) throw error;

          if (rows && rows.length === 1) {
            const newUser = rows[0];
            const token = this.authService.generateToken(newUser.id, data.email);
            return { token, user: newUser };
          }
          // Insert sin error pero sin fila: no reintentamos a ciegas.
          throw new Error('El insert de usuario no devolvió la fila esperada');
        } catch (error: any) {
          if (error.code === '23505') {
            id = randomString();
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

  // --------- Obtener usuario por ID ---------
  async getUserById(id: string) {
    // Intento 1: con las columnas de las 3 disciplinas (ayurveda_* puede no existir
    // todavía si está pendiente el ALTER TABLE → caemos al intento 2).
    const full = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra, psicologia_suscrito, psicologia_fecha_compra, ayurveda_suscrito, ayurveda_fecha_compra')
      .eq('id', id)
      .single();
    if (full.data) return full.data;

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
    const updates: Record<string, string> = {};
    if (body.name) updates.name = body.name;
    if (body.email) updates.email = body.email;
    if (body.password) updates.password = await hashPassword(body.password);

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

  // --------- Eliminar usuario ---------
  // Borra la cuenta y TODOS los datos relacionados con ese usuario:
  // sus filas en cada tabla de disciplina/recorrido, sus reservas de llamada
  // y su foto de perfil en el bucket de storage. La fila de `user` se borra al
  // final. Cada borrado es best-effort: si una tabla falla, se registra el
  // error pero se continúa con las demás para no dejar datos huérfanos.
  async deleteUser(id: string) {
    const db = this.databaseService.getClient();

    // Recuperamos email y foto ANTES de borrar la fila de usuario, porque
    // algunas tablas (bookings) se relacionan por email y la foto vive en storage.
    const { data: userRows } = await db
      .from('user')
      .select('email, img')
      .eq('id', id);
    const user = userRows?.[0] as { email?: string; img?: string } | undefined;

    // Tablas con datos del usuario, cada una con su columna identificadora.
    // (Los nombres de columna difieren entre tablas: user_id, userId, userid, idUser…)
    const relatedTables: { table: string; column: string }[] = [
      { table: 'metodo_psicologia', column: 'user_id' },
      { table: 'metodo_astrologia', column: 'user_id' },
      { table: 'metodo_ayurveda', column: 'user_id' },
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
