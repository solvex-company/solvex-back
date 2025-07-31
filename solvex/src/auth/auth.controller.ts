/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Res,
  BadRequestException,
  Put,
  Param,
} from '@nestjs/common';
import { CreateUserDto, loginDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/GoogleAuthGuard';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtRequest } from './interfaces/jwt-request.interface';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from 'src/auth/changePassword.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  create(@Body() userData: CreateUserDto) {
    const transformedData = {
      ...userData,
      typeId: userData.typeId.toString(),
      identification_number: userData.identification_number.toString(),
    };
    if (isNaN(parseInt(transformedData.typeId, 10))) {
      throw new BadRequestException('typeId must be a valid number');
    }

    return this.authService.create(transformedData);
  }

  @Post('signin')
  signIn(@Body() credentials: loginDto) {
    return this.authService.signIn(credentials);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Autenticación con Google',
    description: `
    Flujo de autenticación:
      Copie esta URL y ábrala en el navegador: https://solvex-2v25.onrender.com/auth/google/login
      El usuario es redirigido a Google para autenticarse
      Google retorna al callback URL con el código
      El servidor intercambia el código por tokens
    Nota: Este endpoint no debe ser llamado directamente desde Swagger UI
  `,
  })
  @ApiResponse({
    status: 302,
  })
  googleLogin(): void {
    // Empty on purpose – just triggers the guard
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  handleRedirect(@Req() req: JwtRequest, @Res() res: Response) {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          'No user found in request after Google login',
        );
      }

      const payload: JwtPayload = req.user;

      const token = this.authService.createJwtToken(payload);
      return res.redirect(
        `${this.configService.get<string>('FRONTEND_URL')!}/auth/callback?token=${token}`,
      );
    } catch (err) {
      console.error('Redirect handler error:', err);
      throw new UnauthorizedException('Google login failed');
    }
  }

  @ApiBearerAuth()
  @Put('changePassword/:id_user')
  @UseGuards(AuthGuard)
  changePassword(
    @Param('id_user') id_user: string,
    @Body() changePassworDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(id_user, changePassworDto);
  }
}
