import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketStatus } from 'src/tickets/entities/statusTickets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketStatusSeeder {
  constructor(
    @InjectRepository(TicketStatus)
    private readonly tikectStatusRepository: Repository<TicketStatus>,
  ) {}

  async seed() {
    const defaultStatus = [
      { id_status: 1, name: 'pending' },
      { id_status: 2, name: 'inProgress' },
      { id_status: 3, name: 'Completed' },
    ];

    for (const statusData of defaultStatus) {
      const typeExists = await this.tikectStatusRepository.findOne({
        where: { id_status: statusData.id_status },
      });

      if (!typeExists) {
        await this.tikectStatusRepository.save(statusData);
      }
    }
  }
}
