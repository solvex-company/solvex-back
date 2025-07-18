/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  ////inicio prueba auth
  @ApiBearerAuth()
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers() {
    return this.usersService.getUsers();
  }
  ///// fin prueba auth

  @ApiBearerAuth()
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAdminUsers(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth()
  @Put('changeRol/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  changeRoleUser(@Param('id') id: string) {
    return this.usersService.changeRolUser(id);
  }
}
