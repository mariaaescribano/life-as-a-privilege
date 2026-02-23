import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database.service';
import { randomString } from 'src/Global';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginUser } from '../dtos/user.types';


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
  async getNomEmailExist(nom: string, email: string): Promise<boolean> {
    const { data } = await this.databaseService.getClient()
      .from('user')
      .select('id')
      .or(`name.eq.${nom},email.eq.${email}`);
    return (data?.length ?? 0) > 0;
  }

  // --------- Crear usuario ---------
  async createUser(data: CreateUser) {
    try {
      const exists = await this.getNomEmailExist(data.name, data.email);
      if (exists) throw new ConflictException('El usuario ya existe');

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
            const token = this.authService.generateToken(newUserId);

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
          const token = this.authService.generateToken(user.id);
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
}
