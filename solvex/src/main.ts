/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NotReturnPasswordInterceptor } from './interceptor/not-return-password.interceptor';
// import * as express from 'express'; // Importa express para usar su body parser
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Solvex Company')
    .setDescription('Esta es una Api construida para el software Solvex')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const configService = app.get(ConfigService);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const frontendUrls = configService.get('ALLOWED_ORIGINS').split(',');
  const allowedOrigins = [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...frontendUrls,
    'http://localhost:3000',
    'https://solvex-front.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new NotReturnPasswordInterceptor());

  await app.listen(process.env.PORT ?? 4000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
