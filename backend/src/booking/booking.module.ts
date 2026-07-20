import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DatabaseService } from 'src/database.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, DatabaseService],
  exports: [BookingService],
})
export class BookingModule {}
