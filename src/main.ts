import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin:
      'https://fincheck-ldg9uziea-jeffersons-projects-d3fe3c92.vercel.app/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
