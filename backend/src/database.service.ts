// database.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  public pool: mysql.Pool;

  constructor(private configService: ConfigService) {
    this.pool = mysql.createPool({
      host: this.configService.get<string>('DB_HOST') || "localhost",
      port: Number(this.configService.get<number>('DB_PORT')) || 3306, 
      user: "root",
      password: "",
      database: "lifeasaprivilege",
    });
  }
}
