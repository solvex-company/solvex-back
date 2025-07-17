import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, loginDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './utils/GoogleAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() userData: CreateUserDto) {
    return this.authService.create(userData);
  }

  @Post('signin')
  signIn(@Body() credentials: loginDto) {
    return this.authService.signIn(credentials);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() req) {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          'No user user found after Google login',
        );
      }

      const payload = req.user;

      const token = this.authService.createJwtToken(payload);

      return token;
    } catch (err) {
      console.error('Redirect handler error:', err);
      throw new UnauthorizedException('Google login failed');
    }
  }
}
