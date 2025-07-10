import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const date = (): string => new Date().toLocaleString();
    console.log(`${req.method} ${req.originalUrl} Request date: ${date()}`);
    next();
  }
}
