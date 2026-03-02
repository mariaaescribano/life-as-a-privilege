// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { DatabaseService } from './database.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from './upload/upload.module';
import { RespuestaModule } from './respuesta/respuesta.module';
import { PaymentModule } from './payment/payment.module';
import { FitoterapiaModule } from './fitoterapia/fitoterapia.module';
import { TcmModule } from './tcm/tcm.module';

export const uploadFolder = join(process.cwd(), 'img');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: uploadFolder, 
      serveRoot: "/img", 
       serveStaticOptions: {
          index: false, // no buscar index.html
        },
    }),
    UsersModule,
    AuthModule,
    UploadModule,
    RespuestaModule,
    PaymentModule,
    FitoterapiaModule,
    TcmModule,
  ],
  providers: [DatabaseService, JwtStrategy],
  exports: [DatabaseService],
})
export class AppModule {}
