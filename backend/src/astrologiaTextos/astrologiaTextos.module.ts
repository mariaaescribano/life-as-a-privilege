import { Module } from '@nestjs/common';
import { AstrologiaTextosController } from './astrologiaTextos.controller';
import { AstrologiaTextosService } from './astrologiaTextos.service';

@Module({
  controllers: [AstrologiaTextosController],
  providers: [AstrologiaTextosService],
})
export class AstrologiaTextosModule {}
