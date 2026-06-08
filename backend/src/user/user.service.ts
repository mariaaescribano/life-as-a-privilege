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
    const { data } = await this.databaseService.getClient()
      .from('user')
      .select('name, email')
      .or(`name.eq.${nom},email.eq.${email}`);
    const nameExists = (data ?? []).some((u: any) => u.name === nom);
    const emailExists = (data ?? []).some((u: any) => u.email === email);
    return { nameExists, emailExists };
  }

  // --------- Crear usuario ---------
  async createUser(data: CreateUser) {
    try {
      const { nameExists, emailExists } = await this.getNomEmailExist(data.name, data.email);
      if (nameExists) throw new ConflictException('El nombre ya existe. Elige otro');
      if (emailExists) throw new ConflictException('El email ya está registrado');

      let inserted = false;
      let id = randomString();
      const pass = await hashPassword(data.password);

      do {
        try {
          const { data: rows, error } = await this.databaseService.getClient()
            .from('user')
            .insert({ id, name: data.name, email: data.email, password: pass })
            .select('id');

          if (error) throw error;

          if (rows && rows.length === 1) {
            inserted = true;
            const newUserId = rows[0].id;
            const token = this.authService.generateToken(newUserId, data.email);

            const { data: users } = await this.databaseService.getClient()
              .from('user')
              .select('*')
              .eq('id', newUserId);

            return { token, user: users?.[0] };
          }

        } catch (error: any) {
          if (error.code === '23505') {
            id = randomString();
          } else {
            throw error;
          }
        }
      } while (!inserted);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // --------- Login ---------
  async logIn(body: LoginUser) {
    try {
      const { data: rows } = await this.databaseService.getClient()
        .from('user')
        .select('*')
        .or(`name.eq.${body.name},email.eq.${body.name}`);

      if (rows && rows.length > 0) {
        const user = rows[0];
        const coinciden = await comparePassword(body.password, user.password);
        if (coinciden) {
          const token = this.authService.generateToken(user.id, user.email);
          return { token, user };
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
    const full = await this.databaseService.getClient()
      .from('user')
      .select('id, name, email, img, metodo_suscrito, metodo_fecha_compra')
      .eq('id', id)
      .single();
    if (full.data) return full.data;

    // Fallback si las columnas metodo_* aún no existen (ALTER TABLE pendiente).
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
    // Buscar usuario existente por email
    const { data: existing } = await this.databaseService.getClient()
      .from('user')
      .select('*')
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

    let inserted = false;
    let id = randomString();

    do {
      try {
        const { data: rows, error } = await this.databaseService.getClient()
          .from('user')
          .insert({ id, name: finalName, email, password: dummyPass, img: img ?? null })
          .select('*');

        if (error) throw error;

        if (rows && rows.length === 1) {
          inserted = true;
          const token = this.authService.generateToken(rows[0].id, rows[0].email);
          return { token, user: rows[0] };
        }
      } catch (error: any) {
        if (error.code === '23505') {
          id = randomString();
        } else {
          throw error;
        }
      }
    } while (!inserted);
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

  // --------- Eliminar usuario ---------
  async deleteUser(id: string) {
    const { error } = await this.databaseService.getClient()
      .from('user')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { message: 'Cuenta eliminada' };
  }
}
