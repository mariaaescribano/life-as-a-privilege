import { ConflictException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database.service';
import { randomString } from 'src/Global';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginUser } from '../dtos/user.types';
import express from "express";
import multer from "multer";
import path from "path";
import mysql from "mysql2/promise"; 


// #region hash

/* Hashing a password turns it into a unique, random-looking code using a salt.

The original password is never stored, only the hash and embedded salt.

To verify, the system recomputes the hash from the entered password and compares it to the stored hash. */

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Determines the strength.
  const hashed = await bcrypt.hash(password, saltRounds); // Generates a random salt automatically
  return hashed;
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}


@Injectable()
export class UserService {
  constructor(private readonly authService: AuthService, private readonly databaseService: DatabaseService) {}
  
  // #region create 
  
  async getNomEmailExist(nom:string, email:string): Promise<boolean> {
    const [result] = await this.databaseService.pool.query(
      'SELECT * from user WHERE name = ? OR email = ?',
      [nom, email]
    );

    return (result as any[]).length > 0;
  }

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
          const [result]: any = await this.databaseService.pool.query(
            'INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)',
            [id, data.name, data.email, pass],
          );

          if (result.affectedRows === 1) {
            const newUserId = result.insertId;
            inserted = true;
            let token = this.authService.generateToken(id);

            const [userRows]: any = await this.databaseService.pool.query(
              'SELECT * FROM user WHERE id = ?',
              [newUserId]
            );

            return {token:token, user: userRows[0]}
          }

        } catch (error: any) {
          if (error.code === 'ER_DUP_ENTRY') {
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

  async logIn(body: LoginUser) {
    try
    {
      const [result] = await this.databaseService.pool.query(
        'SELECT * from user WHERE name = ? OR email = ?',
        [body.name, body.name]
      );

      if((result as any[]).length > 0)
      {
        let coinciden = await comparePassword(body.password, result[0].password);
        if(coinciden)
        {
          let token = this.authService.generateToken(result[0].id);
          const baseUrl = 'http://localhost:3000';
          result[0].img = `${baseUrl.replace(/\/$/, '')}/${result[0].img}`;
          return {token:token, user: result[0]}
        }
        else
        {
          throw new ConflictException('La contraseña es errónea');
        }
      }
      else
      {
        throw new ConflictException('Nombre o email no existen');
      }
    }
    catch(error)
    {
      console.log(error);
      throw error;
    }
  }


  // #region get 

  async getUser() {
    const [result] = await this.databaseService.pool.query(
      'SELECT * from user',
    );

    return result;
  }

 // #region img

  async perfilPicPost(userId: string, file: Express.Multer.File) {
    try {
      const rutaRelativa = `img/${file.filename}`;
      await this.databaseService.pool.execute(
        "UPDATE user SET img = ? WHERE id = ?",
        [rutaRelativa, userId]
      );

      const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
      const url = `${baseUrl.replace(/\/$/, '')}/${rutaRelativa}`;
      return{url:url};
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProfilePic(userId: string) {
    try {
      const [rows]: any = await this.databaseService.pool.query(
        'SELECT img FROM user WHERE id = ?',
        [userId]
      );

      let imgPath = rows[0]?.img;
      if(imgPath)
      { 
        const baseUrl = 'http://localhost:3000';
        const url = `${baseUrl.replace(/\/$/, '')}/${imgPath}`;
        console.log(url)
        return { url:url };
      }
      else
      {
        return null;
      }
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


}
