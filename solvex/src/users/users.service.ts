import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Roles } from './entities/Roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  ////inicio prueba auth
  getUsers() {
    return this.usersRepository.find();
  }
  ///// fin prueba auth

  async getUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id_user: userId },
      relations: ['credentials', 'typeId', 'role'],
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async changeRolUser(id: string): Promise<User> {
    const userFound: User | null = await this.usersRepository.findOne({
      where: { id_user: id },
      relations: ['role'],
    });

    if (!userFound) throw new NotFoundException('user not found');

    const roleId = userFound.role.id_role === 3 ? 2 : 3;

    const newRole: Roles | null = await this.rolesRepository.findOne({
      where: { id_role: roleId },
    });

    if (!newRole) throw new NotFoundException('role not found');

    userFound.role = newRole;

    await this.usersRepository.save(userFound);

    return userFound;
  }
}
