import { Module } from '@nestjs/common';
import { AstrologiaController } from './astrologia.controller';
import { AstrologiaService } from './astrologia.service';
import { DatabaseService } from 'src/database.service';

@Module({
  controllers: [AstrologiaController],
  providers: [AstrologiaService, DatabaseService],
})
export class AstrologiaModule {}
