import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cookieParser from 'cookie-parser';

const server = express();
server.use(cookieParser());

let isAppInitialized = false;

const bootstrap = async () => {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.use(cookieParser());
    app.enableCors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    await app.init();
    isAppInitialized = true;
  }
  return server;
};

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
