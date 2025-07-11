import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
}
