import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix('api');
  await app.listen(port, '0.0.0.0');
}
bootstrap();
