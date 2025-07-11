/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/seeders/user.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Credentials } from 'src/users/entities/Credentials.entity';
import { Roles } from 'src/users/entities/Roles.entity';
import { TypeId } from 'src/users/entities/typeId.entity';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(TypeId)
    private readonly typeIdRepository: Repository<TypeId>,
  ) {}

  async seed() {
    await this.seedUser({
      email: 'admin@solvex.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'Solvex',
      identificationNumber: '987654321',
      phone: '313564564564',
      roleId: 1,
    });

    await this.seedUser({
      email: 'soporte@solvex.com',
      password: 'Soporte123!',
      firstName: 'Soporte',
      lastName: 'Técnico',
      identificationNumber: '123456789',
      phone: '3136066060',
      roleId: 2,
    });
  }

  private async seedUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    identificationNumber: string;
    phone: string;
    roleId: number;
  }) {
    const userExists = await this.userRepository.findOne({
      where: { identification_number: userData.identificationNumber },
    });

    if (!userExists) {
      const [role, typeId] = await Promise.all([
        this.rolesRepository.findOneBy({ id_role: userData.roleId }),
        this.typeIdRepository.findOneBy({ id_typeid: 1 }),
      ]);

      if (!role || !typeId) {
        throw new Error(`Required data not found for user ${userData.email}`);
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const credentials = this.credentialsRepository.create({
        email: userData.email,
        password: hashedPassword,
      });
      await this.credentialsRepository.save(credentials);

      const newUser = this.userRepository.create({
        name: userData.firstName,
        lastname: userData.lastName,
        identification_number: userData.identificationNumber,
        phone: userData.phone,
        typeId: typeId,
        role: role,
        credentials: credentials,
      });

      await this.userRepository.save(newUser);
      console.log(`✅ Usuario ${userData.email} creado exitosamente`);
    }
  }
}
