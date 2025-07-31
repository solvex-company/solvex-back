/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtRequest } from 'src/auth/interfaces/jwt-request.interface';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get own user data',
    description: 'Gets user data from logged user.',
  })
  @ApiResponse({
    description: 'Returns user data',
    schema: {
      example: {
        id_user: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Ana',
        lastname: 'Ramírez',
        identification_number: '987654321',
        phone: '999888777',
      },
    },
  })
  async getOwnUserData(@Req() req: JwtRequest): Promise<User> {
    const userId: string = req.user.id_user;
    console.log(userId);
    return await this.usersService.getOwnUserData(userId);
  }

  @ApiBearerAuth()
  @Get('employees')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getEnployees() {
    return this.usersService.getEnployees();
  }

  @ApiBearerAuth()
  @Get('helpers')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getHelpers() {
    return this.usersService.getHelpers();
  }

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

  @Get('is-password-null')
  @UseGuards(AuthGuard)
  async isPasswordNull(@Req() req: JwtRequest): Promise<boolean> {
    const userId: string = req.user.id_user;
    return await this.usersService.isPasswordNull(userId);
  }
}
