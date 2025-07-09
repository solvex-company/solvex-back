import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  ////inicio prueba auth
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
  ///// fin prueba auth
}
