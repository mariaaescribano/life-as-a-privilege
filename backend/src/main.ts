import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors(); 

  app.enableCors({
    origin: [
      'https://lifeasaprivilege.onrender.com',
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
