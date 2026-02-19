import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || "postgresql://postgres:mariaaescribano@db.lrdenqkwfrrsvhcuqpyy.supabase.co:6543/postgres",
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  async query(text: string, params?: any[]) {
    const res = await this.pool.query(text, params);
    return res.rows;
  }
}
