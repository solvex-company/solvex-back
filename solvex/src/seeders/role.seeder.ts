import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../users/entities/Roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeeder {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async seed() {
    const roles = [
      { id_role: 1, role_name: 'Admin' },
      { id_role: 2, role_name: 'Soporte' },
      { id_role: 3, role_name: 'Empleado' },
    ];

    for (const roleData of roles) {
      const roleExists = await this.roleRepository.findOneBy({
        id_role: roleData.id_role,
      });

      if (!roleExists) {
        const newRole = this.roleRepository.create(roleData);
        await this.roleRepository.save(newRole);
      }
    }
  }
}
