import { Module } from '@nestjs/common';
import { DiarioMariaController } from './diarioMaria.controller';
import { DiarioMariaService } from './diarioMaria.service';
import { DatabaseService } from '../database.service';

@Module({
  controllers: [DiarioMariaController],
  providers: [DiarioMariaService, DatabaseService],
})
export class DiarioMariaModule {}
