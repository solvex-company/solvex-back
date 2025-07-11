import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Credentials } from 'src/users/entities/Credentials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credentials])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
