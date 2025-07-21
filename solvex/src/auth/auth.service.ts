/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, loginDto } from 'src/users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Credentials } from 'src/users/entities/Credentials.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/users/dto/userResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { GoogleProfile } from './interfaces/google-profile.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(userData: CreateUserDto): Promise<UserResponseDto> {
    const emailExists = await this.credentialsRepository.findOne({
      where: { email: userData.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already exist');
    }

    if (userData.password !== userData.password2)
      throw new BadRequestException('Passwords do not match');

    const idNumberExists = await this.usersRepository.findOne({
      where: { identification_number: userData.identification_number },
    });
    if (idNumberExists) {
      throw new ConflictException('the identification number already exist');
    }

    const typeIdNumber = parseInt(userData.typeId, 10);

    const user: User = this.usersRepository.create({
      name: userData.name,
      lastname: userData.lastname,
      identification_number: userData.identification_number.toString(),
      phone: userData.phone.toString(),
      typeId: { id_typeid: typeIdNumber },
      role: { id_role: 3 },
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

  async signIn(credentials: loginDto) {
    const findUser: Credentials | null =
      await this.credentialsRepository.findOne({
        where: { email: credentials.email },
        relations: ['user', 'user.role'],
      });

    if (!findUser) throw new BadRequestException('Incorrect credentials');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      findUser.password,
    );
    if (!passwordMatch) throw new BadRequestException('Incorrect credentials');

    const payload = {
      id: findUser.user.id_user,
      email: findUser.email,
      id_role: findUser.user.role.id_role,
      name: findUser.user.name,
      lastname: findUser.user.lastname,
      phone: findUser.user.phone,
      identification_number: findUser.user.identification_number,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateUser(userData: GoogleProfile) {
    console.log('Validate User');
    console.log(userData);

    if (!userData?.email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.credentialsRepository.findOne({
      where: { email: userData.email },
      relations: ['user', 'user.typeId', 'user.role'],
    });

    if (user) {
      return {
        id: user.user.id_user,
        email: user.email,
        id_role: user.user.role.id_role,
      };
    }

    const newUser: User = this.usersRepository.create({
      name: userData.displayName,
      lastname: userData.familyName,
      identification_number: null,
      phone: null,
      role: { id_role: 3 },
    });

    const savedUser = await this.usersRepository.save(newUser);

    const credentials = this.credentialsRepository.create({
      email: userData.email,
      password: null,
      user: savedUser,
    });

    await this.credentialsRepository.save(credentials);

    return {
      id_user: savedUser.id_user,
      email: credentials.email,
      id_role: savedUser.role.id_role,
    };
  }

  createJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
