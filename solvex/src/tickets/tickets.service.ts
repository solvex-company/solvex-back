/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { TicketStatus } from './entities/statusTickets.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { createTicketDto } from './dto/createTicket.dto';
import { Area } from './entities/areas.entity';
import { ResolutionTicket } from './entities/resolutionsTicket';
import { resolutionTicketDto } from './dto/resolutionTicket.dto';
import { Credentials } from 'src/users/entities/Credentials.entity';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TicketStatus)
    private readonly statusRepository: Repository<TicketStatus>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(Credentials)
    private readonly credentialsRepository: Repository<Credentials>,
    @InjectRepository(ResolutionTicket)
    private readonly resolutionTicketRepository: Repository<ResolutionTicket>,
  ) {}

  async createTicket(
    createTicketData: createTicketDto,
    user: any,
    files?: Express.Multer.File[],
  ): Promise<Ticket> {
    try {
      if (!createTicketData.title || !createTicketData.description) {
        throw new BadRequestException('Title and description are required');
      }

      console.log(`controller ${user.id}`);

      const userFound = await this.userRepository.findOne({
        where: { id_user: user.id },
      });

      if (!userFound) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }

      const defaultStatus = await this.statusRepository.findOne({
        where: { id_status: 1 },
      });

      if (!defaultStatus) {
        throw new NotFoundException('Default ticket status not configured');
      }

      const areaFound = await this.areaRepository.findOne({
        where: { id_area: createTicketData.id_area },
      });

      this.logger.debug(`Buscando área con ID: ${createTicketData.id_area}`);
      this.logger.debug(`Área encontrada: ${JSON.stringify(areaFound)}`);

      if (!areaFound) {
        throw new NotFoundException(
          `Area with ID ${createTicketData.id_area} not found`,
        );
      }

      let imageUrls = ['no image', 'no image', 'no image'];

      if (files && files.length > 0) {
        try {
          imageUrls = await this.fileUploadService.uploadImages(files);
        } catch (uploadError) {
          this.logger.error('Failed to upload images', uploadError.stack);
          throw new InternalServerErrorException(
            'Failed to upload ticket images',
          );
        }
      }

      try {
        const newTicket = this.ticketRepository.create({
          title: createTicketData.title,
          description: createTicketData.description,
          img_1: imageUrls[0],
          img_2: imageUrls[1],
          img_3: imageUrls[2],
          id_empleado: userFound,
          id_status: defaultStatus,
          area: areaFound,
          creation_date: new Date(),
        });
        this.logger.log(`ID EMPLEADO: ${user.id}`);

        const savedTicket = await this.ticketRepository.save(newTicket);
        this.logger.log(
          `Ticket created successfully for area ${areaFound.name} by user ${userFound.id_user}`,
        );

        const foundTicket = await this.ticketRepository.findOne({
          where: { id_ticket: savedTicket.id_ticket },
          relations: ['id_empleado', 'id_status', 'area'],
        });

        if (!foundTicket) {
          throw new NotFoundException('Created ticket not found');
        }

        return foundTicket;
      } catch (dbError) {
        this.logger.error('Database error creating ticket', dbError.stack);
        throw new InternalServerErrorException(
          'Failed to create ticket in database',
        );
      }
    } catch (error) {
      this.logger.error(`Error in createTicket: ${error.message}`, error.stack);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        this.logger.log(`ID EMPLEADO: ${user.id}`);
        throw error;
      }

      this.logger.log(`ID EMPLEADO: ${user.id}`);
      throw new InternalServerErrorException('Failed to create ticket');
    }
  }

  async getAreas(): Promise<Area[]> {
    try {
      this.logger.log('Fetching all areas from database');
      const areas = await this.areaRepository.find({
        select: ['id_area', 'name'],
        order: { id_area: 'ASC' },
      });

      if (!areas || areas.length === 0) {
        this.logger.warn('No areas found in database');
        return [];
      }

      return areas;
    } catch (error) {
      this.logger.error('Failed to fetch areas', error.stack);
      throw new InternalServerErrorException('Could not retrieve areas');
    }
  }

  async getAllTickets(): Promise<Ticket[]> {
    try {
      this.logger.log('Fetching all tickets from database');

      const tickets = await this.ticketRepository.find({
        relations: ['id_empleado', 'id_status', 'area'],
        order: {
          creation_date: 'DESC',
        },
      });

      if (!tickets || tickets.length === 0) {
        this.logger.warn('No tickets found in database');
        return [];
      }

      this.logger.log(`Found ${tickets.length} tickets`);
      return tickets;
    } catch (error) {
      this.logger.error('Failed to fetch tickets', error.stack);
      throw new InternalServerErrorException('Could not retrieve tickets');
    }
  }

  async getTicketById(ticketId: number) {
    const ticketFound: Ticket | null = await this.ticketRepository.findOne({
      where: { id_ticket: ticketId },
      relations: ['id_empleado', 'id_status', 'id_helper', 'area'],
    });

    if (!ticketFound)
      throw new NotFoundException(`Ticket con id ${ticketId} no se encontró`);

    return ticketFound;
  }

  async resolutionTicket(resolutionTicketDto: resolutionTicketDto) {
    const credentialFound: Credentials | null =
      await this.credentialsRepository.findOne({
        where: { email: resolutionTicketDto.helperEmail },
        relations: ['user'],
      });

    if (!credentialFound)
      throw new NotFoundException(
        `${resolutionTicketDto.helperEmail} not found`,
      );

    if (!resolutionTicketDto.response) {
      throw new BadRequestException('Response are required');
    }

    const ticketFound: Ticket | null = await this.ticketRepository.findOne({
      where: { id_ticket: resolutionTicketDto.id_ticket },
    });

    if (!ticketFound)
      throw new NotFoundException(
        `Ticket with id: ${resolutionTicketDto.id_ticket} does not exist`,
      );

    const ticketStatusFound: TicketStatus | null =
      await this.statusRepository.findOne({
        where: { name: resolutionTicketDto.ticketStatus },
      });

    if (!ticketStatusFound)
      throw new NotFoundException(
        `No se encontro ticket status ${resolutionTicketDto.ticketStatus}`,
      );

    if (ticketStatusFound.name === 'Completed') {
      ticketFound.closing_date = new Date();
      await this.ticketRepository.save(ticketFound);
    }

    ticketFound.id_status = ticketStatusFound;
    ticketFound.id_helper = credentialFound.user;

    await this.ticketRepository.save(ticketFound);

    const newResolutionTicket: ResolutionTicket =
      this.resolutionTicketRepository.create({
        response: resolutionTicketDto.response,
        id_helper: credentialFound.user,
        ticket: ticketFound,
        status: ticketStatusFound,
      });

    await this.resolutionTicketRepository.save(newResolutionTicket);

    return newResolutionTicket;
  }

  async getResolutionTicketById(idResolution: number) {
    const resolutionTicketFound: ResolutionTicket | null =
      await this.resolutionTicketRepository.findOne({
        where: { id_resolution_ticket: idResolution },
      });

    if (!resolutionTicketFound)
      throw new NotFoundException(`Ticket with id: ${idResolution} not found`);

    return resolutionTicketFound;
  }

  async getTicketsReport() {
    try {
      const [statusCounts, supportEmployees] = await Promise.all([
        this.getTicketsByStatus(),
        this.getSupportEmployees(),
      ]);

      const totalIncidencias = statusCounts.reduce(
        (total, item) => total + item.value,
        0,
      );

      return {
        incidenciasPorEstado: statusCounts,
        empleadosSoporte: supportEmployees,
        totalIncidencias,
      };
    } catch (error) {
      console.error('Error en getTicketsReport:', error);
      throw new HttpException(
        'Error al generar el reporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getTicketsByStatus() {
    const statuses = await this.statusRepository.find();

    return Promise.all(
      statuses.map(async (status) => {
        const count = await this.ticketRepository
          .createQueryBuilder('ticket')
          .where('ticket.id_status = :statusId', { statusId: status.id_status })
          .getCount();

        return {
          name: this.getStatusName(status.id_status),
          value: count,
        };
      }),
    );
  }

  private getStatusName(id: number): string {
    const statusMap = {
      1: 'Pendientes',
      2: 'En Progreso',
      3: 'Completados',
    };
    return statusMap[id] || 'Desconocido';
  }

  private async getSupportEmployees() {
    const users = await this.userRepository.find({
      where: { role: { id_role: 2 } },
      select: ['id_user', 'name', 'lastname'],
    });

    return users.map((user) => ({
      id: user.id_user,
      nombre: `${user.name} ${user.lastname}`,
    }));
  }
}
