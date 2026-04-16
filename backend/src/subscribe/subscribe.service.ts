import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

const FILE_PATH = join(process.cwd(), 'subscribers.txt');

@Injectable()
export class SubscribeService {
  async addEmail(email: string): Promise<void> {
    const line = `${email} | ${new Date().toISOString()}\n`;
    await fs.appendFile(FILE_PATH, line, 'utf-8');
  }
}
