import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/tickets/entities/areas.entity';
import { TicketStatus } from 'src/tickets/entities/statusTickets.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Credentials } from 'src/users/entities/Credentials.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketEmployeeSedder {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(TicketStatus)
    private readonly ticketStatusRepository: Repository<TicketStatus>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async ticketSeeder(ticketData: {
    id_ticket: number;
    title: string;
    description: string;
    statusName: string;
    employeeEmail: string;
    areaName: string;
  }) {
    const employeeCredentialFound: Credentials | null =
      await this.credentialsRepository.findOne({
        where: { email: ticketData.employeeEmail },
        relations: ['user'],
      });

    if (!employeeCredentialFound)
      throw new NotFoundException(
        `email ${ticketData.employeeEmail} not found`,
      );

    const employee: User = employeeCredentialFound.user;

    const statusFound: TicketStatus | null =
      await this.ticketStatusRepository.findOne({
        where: { name: ticketData.statusName },
      });

    if (!statusFound)
      throw new BadRequestException(
        `status ${ticketData.statusName} not exist`,
      );

    const areaFound: Area | null = await this.areaRepository.findOne({
      where: { name: ticketData.areaName },
    });

    if (!areaFound)
      throw new BadRequestException(`area ${ticketData.areaName} not exist`);

    if (!ticketData.title || !ticketData.description)
      throw new BadRequestException('title and description are require');

    const newTicket: Ticket = this.ticketRepository.create({
      id_ticket: ticketData.id_ticket,
      title: ticketData.title,
      description: ticketData.description,
      creation_date: new Date(new Date().setDate(new Date().getDate() - 3)),
      id_status: statusFound,
      id_empleado: employee,
      area: areaFound,
    });

    const ticketFound = await this.ticketRepository.findOne({
      where: { id_ticket: ticketData.id_ticket },
    });

    if (ticketFound) return;

    await this.ticketRepository.save(newTicket);

  }

  async seed() {
    // Ticket para Recursos Humanos
    await this.ticketSeeder({
      id_ticket: 3,
      title: 'Error en mi nómina',
      description:
        'Mis días de vacaciones no aparecen correctamente en el último recibo',
      statusName: 'pending',
      employeeEmail: 'robert.miller@solvex.com',
      areaName: 'Recursos Humanos',
    });

    // Ticket para Finanzas
    await this.ticketSeeder({
      id_ticket: 4,
      title: 'Reembolso pendiente',
      description:
        'Mi reembolso de gastos de viaje de marzo aún no ha sido procesado',
      statusName: 'pending',
      employeeEmail: 'robert.miller@solvex.com',
      areaName: 'Finanzas',
    });

    // Ticket para Operaciones
    await this.ticketSeeder({
      id_ticket: 5,
      title: 'Problema con envío de materiales',
      description:
        'El pedido #45678 con materiales de oficina lleva 2 semanas de retraso',
      statusName: 'pending',
      employeeEmail: 'robert.miller@solvex.com',
      areaName: 'Operaciones',
    });

    // Ticket para Marketing
    await this.ticketSeeder({
      id_ticket: 6,
      title: 'Error en campaña publicitaria',
      description:
        'Los anuncios de Google Ads están redirigiendo a una página 404',
      statusName: 'pending',
      employeeEmail: 'robert.miller@solvex.com',
      areaName: 'Marketing',
    });
  }
}
