import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/createTicket.dto';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createTicket(ticketData: CreateTicketDto): Promise<Ticket> {
    const userFound: User | null = await this.userRepository.findOne({
      where: { id_user: ticketData.id_empleado },
    });

    if (!userFound) throw new NotFoundException('Employee not found');

    const newTicket = this.ticketRepository.create({
      title: ticketData.title,
      description: ticketData.description,
      img_1: ticketData.img_1,
      img_2: ticketData.img_1,
      img_3: ticketData.img_1,
      id_empleado: userFound,
    });

    await this.ticketRepository.save(newTicket);

    return newTicket;
  }
}
