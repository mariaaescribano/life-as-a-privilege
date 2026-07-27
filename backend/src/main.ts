import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

// Dominios que pueden llamar a la API. Los de siempre van fijos aquí, y con la
// variable de entorno FRONTEND_ORIGINS (separados por comas) se añaden más SIN
// tocar el código ni volver a desplegar — que es lo que hará falta el día que
// se estrene dominio propio:
//     FRONTEND_ORIGINS="https://lifeasaprivilege.com, https://www.lifeasaprivilege.com"
// Sin eso, la web nueva carga pero TODAS sus peticiones fallan por CORS.
function origenesPermitidos(): string[] {
  const fijos = [
    'https://lifeasaprivilege.onrender.com',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3000',
  ];
  const extra = (process.env.FRONTEND_ORIGINS ?? '')
    .split(',')
    // sin barra final: la cabecera Origin nunca la lleva y no casaría
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
  // FRONTEND_URL ya se usa para las URLs de vuelta de Stripe. Si apunta al
  // dominio nuevo, darlo por bueno aquí también evita el despiste clásico de
  // cambiar una variable y dejarse la otra.
  const desdeFrontendUrl = (process.env.FRONTEND_URL ?? '').trim().replace(/\/$/, '');
  return [...new Set([...fijos, ...extra, ...(desdeFrontendUrl ? [desdeFrontendUrl] : [])])];
}

async function bootstrap() {
  // `rawBody: true` guarda el cuerpo SIN parsear en `req.rawBody` (además del
  // JSON de siempre). El webhook de Stripe lo necesita: la firma se calcula
  // sobre los bytes exactos que envió Stripe, así que si solo tuviéramos el
  // objeto ya parseado no podríamos verificarla.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  // CONFIAR EN EL PROXY. Imprescindible para que el límite por IP funcione: en
  // Render la petición llega a través de su balanceador, así que sin esto todas
  // las peticiones parecen venir de la MISMA IP (la del proxy) y el límite se
  // aplicaría a todos los usuarios en común — la web se caería sola con cuatro
  // personas dentro. Con `trust proxy` se usa la IP real de X-Forwarded-For.
  app.set('trust proxy', 1);

  // Cabeceras de seguridad (helmet). Dos ajustes a medida:
  //  · contentSecurityPolicy: false → esto es una API que devuelve JSON; la CSP
  //    es cosa del HTML que sirve el frontend, y activarla aquí solo estorba.
  //  · crossOriginResourcePolicy 'cross-origin' → el backend sirve las fotos de
  //    perfil en /img y las pide el frontend, que está en OTRO dominio. Con el
  //    valor por defecto ('same-origin') el navegador bloquearía esas imágenes.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const origins = origenesPermitidos();
  app.enableCors({ origin: origins, credentials: true });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`   CORS permitido para: ${origins.join(', ')}`);
}
bootstrap();
