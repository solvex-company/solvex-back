/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotReturnPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removePasswordFromData(data)));
  }

  private removePasswordFromData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removePassword(item));
    } else if (data && typeof data === 'object' && !(data instanceof Date)) {
      return this.removePassword(data);
    }
    return data;
  }

  private removePassword(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    // Elimina password del objeto principal
    const { password, ...rest } = obj;
    let result = rest;

    // Si el objeto tiene una propiedad 'credentials' que contiene password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.credentials && typeof result.credentials === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const { password: credPassword, ...credRest } = result.credentials;
      result = { ...result, credentials: credRest };
    }

    return result;
  }
}
