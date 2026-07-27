import { NestFactory } from '@nestjs/core';
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
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const origins = origenesPermitidos();
  app.enableCors({ origin: origins, credentials: true });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`   CORS permitido para: ${origins.join(', ')}`);
}
bootstrap();
