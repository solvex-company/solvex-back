/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token no enviado');
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Formato de token invalido');
    }

    const secret = process.env.JWT_SECRET;

    try {
      const user = this.jwtService.verify(token, { secret });

      if (user.id_role === 1) user.roles = [Role.ADMIN];
      if (user.id_role === 2) user.roles = [Role.HELPER];
      if (user.id_role === 3) user.roles = [Role.EMPLOYEE];

      user.exp = new Date(user.exp * 1000);
      user.iat = new Date(user.iat * 1000);

      request.user = user;

      console.log(user.roles);
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }
}
