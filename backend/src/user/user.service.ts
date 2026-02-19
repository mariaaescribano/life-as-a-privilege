import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database.service';
import { randomString } from 'src/Global';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginUser } from '../dtos/user.types';
import express from "express";


// #region hash

/* Hashing a password turns it into a unique, random-looking code using a salt.

The original password is never stored, only the hash and embedded salt.

To verify, the system recomputes the hash from the entered password and compares it to the stored hash. */

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}


@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService, private readonly databaseService: DatabaseService) {}
  
  // --------- Verifica si el nombre o email existen ---------
  async getNomEmailExist(nom:string, email:string): Promise<boolean> {
    const rows = await this.databaseService.query(
      'SELECT * FROM "user" WHERE name = $1 OR email = $2',
      [nom, email]
    );
    return rows.length > 0;
  }

  // --------- Crear usuario ---------
  async createUser(data: CreateUser) {
    try {
      const existeNom = await this.getNomEmailExist(data.name, data.email);
      if (existeNom) {
        throw new ConflictException('El usuario ya existe');
      }

      let inserted = false;
      let id = randomString();
      const pass = await hashPassword(data.password);

      do {
        try {
          // INSERT con RETURNING id
          const rows = await this.databaseService.query(
            'INSERT INTO "user" (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [id, data.name, data.email, pass]
          );

          if (rows.length === 1) {
            inserted = true;
            const newUserId = rows[0].id;
            const token = this.authService.generateToken(newUserId);

            const [user] = await this.databaseService.query(
              'SELECT * FROM "user" WHERE id = $1',
              [newUserId]
            );

            return { token, user };
          }

        } catch (error: any) {
          // Si choca con id duplicado, genera otro
          if (error.code === '23505') { // unique_violation en Postgres
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
      const rows = await this.databaseService.query(
        'SELECT * FROM "user" WHERE name = $1 OR email = $1',
        [body.name]
      );

      if (rows.length > 0) {
        const user = rows[0];
        const coinciden = await comparePassword(body.password, user.password);
        if (coinciden) {
          const token = this.authService.generateToken(user.id);
          const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
          user.img = user.img ? `${baseUrl.replace(/\/$/, '')}/${user.img}` : null;
          return { token, user };
        } else {
          throw new ConflictException('La contraseña es errónea');
        }
      } else {
        throw new ConflictException('Nombre o email no existen');
      }
    } catch(error) {
      console.log(error);
      throw error;
    }
  }

  // --------- Obtener todos los usuarios ---------
  async getUser() {
    const rows = await this.databaseService.query(
      'SELECT * FROM "user"'
    );
    return rows;
  }

  // --------- Subir foto de perfil ---------
  // async perfilPicPost(userId: string, file: Express.Multer.File) {
  //   try {
  //     const rutaRelativa = `img/${file.filename}`;

  //     await this.databaseService.query(
  //       'UPDATE "user" SET img = $1 WHERE id = $2',
  //       [rutaRelativa, userId]
  //     );

  //     return { rutaRelativa };
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  // // --------- Obtener foto de perfil ---------
  // async getProfilePic(userId: string) {
  //   try {
  //     const rows = await this.databaseService.query(
  //       'SELECT img FROM "user" WHERE id = $1',
  //       [userId]
  //     );

  //     const imgPath = rows[0]?.img;
  //     if (imgPath) {
  //       return { imgPath };
  //     } else {
  //       return null;
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  //}

}
