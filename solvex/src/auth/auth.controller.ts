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
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtRequest } from './interfaces/jwt-request.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() userData: CreateUserDto) {
    console.log(userData);
    return this.authService.create(userData);
  }

  @Post('signin')
  signIn(@Body() credentials: loginDto) {
    return this.authService.signIn(credentials);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth Login',
    description: 'Redirects to Google for authentication.',
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
  handleRedirect(@Req() req: JwtRequest): string {
    try {
      if (!req.user) {
        throw new UnauthorizedException(
          'No user found in request after Google login',
        );
      }

      const payload: JwtPayload = req.user;

      const token = this.authService.createJwtToken(payload);

      return token;
    } catch (err) {
      console.error('Redirect handler error:', err);
      throw new UnauthorizedException('Google login failed');
    }
  }
}
