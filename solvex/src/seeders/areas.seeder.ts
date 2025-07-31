import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/tickets/entities/areas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaSeeder {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async seed() {
    const areasToCreate = [
      { name: 'Tecnología' },
      { name: 'Recursos Humanos' },
      { name: 'Finanzas' },
      { name: 'Operaciones' },
      { name: 'Marketing' },
    ];

    try {
      const existingAreas = await this.areaRepository.find();

      if (existingAreas.length === 0) {
        await this.areaRepository.save(areasToCreate);
        return {
          success: true,
          message: 'Áreas creadas exitosamente',
        };
      } else {
        return {
          success: false,
          message: 'Las áreas ya existen en la base de datos',
        };
      }
    } catch (error) {
      console.error('Error ejecutando el seeder de áreas:', error);
      throw error;
    }
  }
}
