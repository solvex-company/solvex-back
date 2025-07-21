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

    await this.seedUser({
      email: 'john.smith@solvex.com',
      password: 'Manager123!',
      firstName: 'John',
      lastName: 'Smith',
      identificationNumber: '100000001',
      phone: '5551000001',
      roleId: 2,
    });

    await this.seedUser({
      email: 'emily.johnson@solvex.com',
      password: 'Manager123!',
      firstName: 'Emily',
      lastName: 'Johnson',
      identificationNumber: '100000002',
      phone: '5551000002',
      roleId: 2,
    });

    await this.seedUser({
      email: 'michael.williams@solvex.com',
      password: 'Manager123!',
      firstName: 'Michael',
      lastName: 'Williams',
      identificationNumber: '100000003',
      phone: '5551000003',
      roleId: 2,
    });

    await this.seedUser({
      email: 'sarah.brown@solvex.com',
      password: 'Manager123!',
      firstName: 'Sarah',
      lastName: 'Brown',
      identificationNumber: '100000004',
      phone: '5551000004',
      roleId: 2,
    });

    await this.seedUser({
      email: 'david.jones@solvex.com',
      password: 'Manager123!',
      firstName: 'David',
      lastName: 'Jones',
      identificationNumber: '100000005',
      phone: '5551000005',
      roleId: 2,
    });

    await this.seedUser({
      email: 'robert.miller@solvex.com',
      password: 'User123!',
      firstName: 'Robert',
      lastName: 'Miller',
      identificationNumber: '200000001',
      phone: '5552000001',
      roleId: 3,
    });

    await this.seedUser({
      email: 'jessica.wilson@solvex.com',
      password: 'User123!',
      firstName: 'Jessica',
      lastName: 'Wilson',
      identificationNumber: '200000002',
      phone: '5552000002',
      roleId: 3,
    });

    await this.seedUser({
      email: 'christopher.taylor@solvex.com',
      password: 'User123!',
      firstName: 'Christopher',
      lastName: 'Taylor',
      identificationNumber: '200000003',
      phone: '5552000003',
      roleId: 3,
    });

    await this.seedUser({
      email: 'amanda.anderson@solvex.com',
      password: 'User123!',
      firstName: 'Amanda',
      lastName: 'Anderson',
      identificationNumber: '200000004',
      phone: '5552000004',
      roleId: 3,
    });
  }

  async seedUserMatthewThomas() {
    await this.seedUser({
      email: 'matthew.thomas@solvex.com',
      password: 'User123!',
      firstName: 'Matthew',
      lastName: 'Thomas',
      identificationNumber: '200000005',
      phone: '5552000005',
      roleId: 3,
    });
  }

  async seedUserElizabethJackson() {
    await this.seedUser({
      email: 'elizabeth.jackson@solvex.com',
      password: 'User123!',
      firstName: 'Elizabeth',
      lastName: 'Jackson',
      identificationNumber: '200000006',
      phone: '5552000006',
      roleId: 3,
    });
  }

  async seedManagerJenniferDavis() {
    await this.seedUser({
      email: 'jennifer.davis@solvex.com',
      password: 'Manager123!',
      firstName: 'Jennifer',
      lastName: 'Davis',
      identificationNumber: '100000006',
      phone: '5551000006',
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
