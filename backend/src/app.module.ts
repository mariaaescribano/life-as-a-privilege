// app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LIMITE_GENERAL } from './rate-limit';
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
import { AstrologiaModule } from './astrologia/astrologia.module';
import { ContactModule } from './contact/contact.module';
import { CabalaModule } from './cabala/cabala.module';
import { NutricionModule } from './nutricion/nutricion.module';
import { AyurvedaModule } from './ayurveda/ayurveda.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { OpinionModule } from './opinion/opinion.module';
import { MailModule } from './mail/mail.module';
import { MetodoAstrologiaModule } from './metodoAstrologia/metodoAstrologia.module';
import { MetodoPsicologiaModule } from './metodoPsicologia/metodoPsicologia.module';
import { MetodoAyurvedaModule } from './metodoAyurveda/metodoAyurveda.module';
import { MetodoTcmModule } from './metodoTcm/metodoTcm.module';
import { MetodoFisiologiaModule } from './metodoFisiologia/metodoFisiologia.module';
import { MetodoNutricionModule } from './metodoNutricion/metodoNutricion.module';
import { MetodoCabalaModule } from './metodoCabala/metodoCabala.module';
import { MetodoNotasModule } from './metodoNotas/metodoNotas.module';
import { BookingModule } from './booking/booking.module';
import { CursosModule } from './cursos/cursos.module';
import { AstrologiaTextosModule } from './astrologiaTextos/astrologiaTextos.module';
import { RecorridoProgresoModule } from './recorridoProgreso/recorridoProgreso.module';
import { EstudioModule } from './estudio/estudio.module';

export const uploadFolder = join(process.cwd(), 'img');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Límite de peticiones por IP. Un único limitador global; las rutas
    // sensibles lo estrechan con @Throttle (ver rate-limit.ts).
    ThrottlerModule.forRoot([LIMITE_GENERAL]),
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
    AstrologiaModule,
    ContactModule,
    CabalaModule,
    NutricionModule,
    AyurvedaModule,
    SubscribeModule,
    OpinionModule,
    MailModule,
    MetodoAstrologiaModule,
    MetodoPsicologiaModule,
    MetodoAyurvedaModule,
    MetodoTcmModule,
    MetodoFisiologiaModule,
    MetodoNutricionModule,
    MetodoCabalaModule,
    MetodoNotasModule,
    BookingModule,
    CursosModule,
    AstrologiaTextosModule,
    RecorridoProgresoModule,
    EstudioModule,
  ],
  providers: [
    DatabaseService,
    JwtStrategy,
    // Guard GLOBAL: el límite se aplica a todas las rutas sin tener que
    // acordarse de ponerlo en cada controlador (que es como se olvida).
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [DatabaseService],
})
export class AppModule {}
