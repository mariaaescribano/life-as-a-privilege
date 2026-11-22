import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { DatabaseService } from 'src/database.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [BookingController],
  providers: [BookingService, DatabaseService],
  exports: [BookingService],
})
export class BookingModule {}
