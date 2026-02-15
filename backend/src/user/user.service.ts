import { Injectable } from '@nestjs/common';
import { pool } from 'src/app.module';
import { randomString } from 'src/Global';

@Injectable()
export class UserService {
  
  async createUser(data) 
  {
    try {
      let id = randomString();

      const [result] = await pool.query(
        'INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)',
        [id, data.name, data.email, data.password],
      );

      if ((result as any).affectedRows === 1) {
        return { id };
      }

    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  async getUser(userId:string) {
    const [result] = await pool.query(
      'SELECT * from usuario WHERE id = ?',
      [userId],
    );

    return result;
  }
}
