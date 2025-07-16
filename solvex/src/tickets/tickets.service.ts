/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// tickets.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { TicketStatus } from './entities/statusTickets.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { createTicketDto } from './dto/createTicket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TicketStatus)
    private readonly statusRepository: Repository<TicketStatus>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createTicket(
    createTicketData: createTicketDto,
    files?: Express.Multer.File[],
  ): Promise<Ticket> {
    const userFound = await this.userRepository.findOne({
      where: { id_user: createTicketData.id_empleado },
    });

    if (!userFound) throw new NotFoundException('Empleado no encontrado');

    const defaultStatus = await this.statusRepository.findOne({
      where: { id_status: 1 },
    });

    if (!defaultStatus) throw new NotFoundException('status not found');

    const imageUrls = files
      ? await this.fileUploadService.uploadImages(files)
      : ['no image', 'no image', 'no image'];

    const newTicket = this.ticketRepository.create({
      title: createTicketData.title,
      description: createTicketData.description,
      img_1: imageUrls[0],
      img_2: imageUrls[1],
      img_3: imageUrls[2],
      id_empleado: userFound,
      id_status: defaultStatus,
      creation_date: new Date(),
    });

    return this.ticketRepository.save(newTicket);
  }
}
