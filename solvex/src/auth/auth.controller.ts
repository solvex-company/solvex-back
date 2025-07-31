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
    console.log(userData);
    const transformedData = {
      ...userData,
      typeId: userData.typeId.toString(),
      identification_number: userData.identification_number.toString(),
    };
    if (isNaN(parseInt(transformedData.typeId, 10))) {
      throw new BadRequestException('typeId must be a valid number');
    }

    console.log(transformedData);
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
    <b>Flujo de autenticación:</b>
    <ol>
      <li>El usuario es redirigido a Google para autenticarse</li>
      <li>Google retorna al callback URL con el código</li>
      <li>El servidor intercambia el código por tokens</li>
    </ol>
    <b>Nota:</b> Este endpoint no debe ser llamado directamente desde Swagger UI
  `,
  })
  @ApiResponse({
    status: 204,
  })
  googleLogin(): void {
    // Empty on purpose – just triggers the guard
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth Redirect',
    description: 'Handles the Google login callback and returns a JWT token.',
  })
  @ApiResponse({
    description: 'Returns JWT token',
    schema: {
      example: 'your-jwt-token',
    },
  })
  handleRedirect(@Req() req: JwtRequest, @Res() res: Response) {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          'No user found in request after Google login',
        );
      }

      const payload: JwtPayload = req.user;

      const token = this.authService.createJwtToken(payload);
      console.log(this.configService.get<string>('FRONTEND_URL'));
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
