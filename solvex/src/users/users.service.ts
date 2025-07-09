import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Credentials } from './entities/Credentials.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/userResponse.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
  ) {}

  async create(userData: CreateUserDto): Promise<UserResponseDto> {
    const emailExists = await this.credentialsRepository.findOne({
      where: { email: userData.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already exist');
    }

    const idNumberExists = await this.usersRepository.findOne({
      where: { identification_number: userData.identification_number },
    });
    if (idNumberExists) {
      throw new ConflictException('the identification number already exist');
    }

    const user: User = this.usersRepository.create({
      first_name: userData.first_name,
      second_name: userData.second_name || '',
      first_surname: userData.first_surname,
      second_surname: userData.second_surname,
      identification_number: userData.identification_number,
      phone: userData.phone.toString(),
      typeId: { id_typeid: userData.typeId },
      role: { id_role: userData.role },
    });

    const savedUser = await this.usersRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword: string = await bcrypt.hash(userData.password, 10);

    const credentials = this.credentialsRepository.create({
      email: userData.email,
      password: hashedPassword,
      user: savedUser,
    });

    await this.credentialsRepository.save(credentials);

    const userWithRelations = await this.usersRepository.findOneOrFail({
      where: { id_user: savedUser.id_user },
      relations: ['typeId', 'role'],
    });

    if (!userWithRelations) {
      throw new NotFoundException(
        'The user not found after creation, please try again',
      );
    }

    const { typeId, role, ...userFields } = userWithRelations;
    return {
      ...userFields,
      typeId: { id_typeid: typeId.id_typeid, name: typeId.name },
      role: { id_role: role.id_role, role_name: role.role_name },
    };
  }
}
