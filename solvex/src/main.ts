import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NotReturnPasswordInterceptor } from './interceptor/not-return-password.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Solvex Company')
    .setDescription('Esta es una Api construida para el software Solvex')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new NotReturnPasswordInterceptor());

  await app.listen(process.env.PORT ?? 4000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
