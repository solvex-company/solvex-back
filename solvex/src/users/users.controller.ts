import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, loginDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Post('signin')
  signIn(@Body() credentials: loginDto) {
    return this.usersService.signIn(credentials);
  }
}
