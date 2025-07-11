import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeId } from 'src/users/entities/typeId.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeIdSeeder {
  constructor(
    @InjectRepository(TypeId)
    private readonly typeIdRepository: Repository<TypeId>,
  ) {}

  async seed() {
    const defaultTypes = [
      { id_typeid: 1, name: 'C.C' },
      { id_typeid: 2, name: 'D.N.I' },
      { id_typeid: 3, name: 'T.I' },
    ];

    for (const typeData of defaultTypes) {
      const typeExists = await this.typeIdRepository.findOneBy({
        id_typeid: typeData.id_typeid,
      });

      if (!typeExists) {
        await this.typeIdRepository.save(typeData);
      }
    }
  }
}
