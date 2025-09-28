import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedade não definidas no DTO
      //transform: true, // Tenta fazer transformação de tipo correta de parametro passsado de um controller para um service.
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
