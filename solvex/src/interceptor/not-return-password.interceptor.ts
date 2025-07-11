/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Credentials } from 'src/users/entities/Credentials.entity';

@Injectable()
export class NotReturnPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((credentials: Credentials) =>
            this.notReturnPassword(credentials),
          );
        } else if (data && typeof data === 'object') {
          return this.notReturnPassword(data as Credentials);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }

  private notReturnPassword(
    credentials: Credentials,
  ): Omit<Credentials, 'password'> {
    if (!credentials) return credentials;
    const { password, ...rest } = credentials;
    return rest;
  }
}
