import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  ////inicio prueba auth
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers() {
    return this.usersService.getUsers();
  }
  ///// fin prueba auth
}
