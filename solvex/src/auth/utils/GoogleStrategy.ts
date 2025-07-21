import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('google.clientID')!,
      clientSecret: configService.get<string>('google.clientSecret')!,
      callbackURL: configService.get<string>('google.callbackURL')!,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) throw new BadRequestException('Google account has no email');

      const user = await this.authService.validateUser({
        email,
        displayName: profile.name?.givenName || 'noNameProvidedByGoogle',
        familyName: profile.name?.familyName || 'noLastNameProvidedByGoogle',
      });

      if (!user) {
        throw new UnauthorizedException('Failed to validate or create user');
      }

      return user;
    } catch (error) {
      console.error('GoogleStrategy validate error:', error);
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
