import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/tickets/entities/areas.entity';
import { TicketStatus } from 'src/tickets/entities/statusTickets.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Credentials } from 'src/users/entities/Credentials.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketSeeder {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TicketStatus)
    private readonly statusRepository: Repository<TicketStatus>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
  ) {}

  async seed() {
    if ((await this.ticketRepository.count()) > 0) return;

    const [defaultStatus, defaultArea] = await Promise.all([
      this.statusRepository.findOne({ where: { id_status: 1 } }),
      this.areaRepository.findOne({ where: { id_area: 1 } }),
    ]);

    const adminCredentials = await this.credentialsRepository.findOne({
      where: { email: 'admin@solvex.com' },
      relations: ['user'],
    });

    if (!defaultStatus || !defaultArea || !adminCredentials?.user) {
      console.warn('⚠️ Faltan dependencias para crear el ticket de ejemplo');
      return;
    }

    await this.ticketRepository.save(
      this.ticketRepository.create({
        title: 'Problema inicial con la impresora',
        description: 'La impresora muestra luz roja y no responde',
        creation_date: new Date(),
        img_1: 'no image',
        img_2: 'no image',
        img_3: 'no image',
        id_status: defaultStatus,
        id_empleado: adminCredentials.user,
        area: defaultArea,
      }),
    );

    console.log('✅ Ticket de ejemplo creado exitosamente');
  }
}
