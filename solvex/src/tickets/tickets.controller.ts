/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  UseGuards,
  Get,
  UnauthorizedException,
  Request,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TicketsService } from '../tickets/tickets.service';
import { createTicketDto } from './dto/createTicket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/roles.guard';
import { resolutionTicketDto } from './dto/resolutionTicket.dto';

@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @Post('createTicket')
  @Roles(Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create ticket with images',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Problema con la impresora',
          description: 'Título del ticket',
        },
        description: {
          type: 'string',
          example: 'La impresora no responde y muestra luz roja',
          description: 'Descripción detallada del problema',
        },
        id_area: {
          type: 'number',
          example: 1,
          description: 'ID del área relacionada',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          maxItems: 3,
          description: 'Sube hasta 3 imágenes del problema',
          example: ['imagen1.jpg', 'imagen2.png'], // Esto es solo para documentación
        },
      },
      required: ['title', 'description', 'id_area'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', 3))
  async createTicket(
    @Request() req: any,
    @Body() createTicketData: createTicketDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.ticketsService.createTicket(
      {
        ...createTicketData,
      },
      req.user,
      files,
    );
  }

  @Get('getAreas')
  @UseGuards(AuthGuard)
  getAreas() {
    return this.ticketsService.getAreas();
  }

  @Get('getAllTickets')
  @Roles(Role.EMPLOYEE, Role.HELPER, Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAllTickets() {
    return this.ticketsService.getAllTickets();
  }

  @ApiBearerAuth()
  @Get(':ticketId')
  @Roles(Role.HELPER, Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  getTicketById(@Param('ticketId') ticketId: number) {
    return this.ticketsService.getTicketById(ticketId);
  }

  @ApiBearerAuth()
  @Post('resolutionTicket')
  @Roles(Role.HELPER)
  @UseGuards(AuthGuard, RolesGuard)
  resolutionTicket(@Body() resolutionTicketDto: resolutionTicketDto) {
    return this.ticketsService.resolutionTicket(resolutionTicketDto);
  }

  @ApiBearerAuth()
  @Get('resolution/:idResolution')
  @Roles(Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  getResolutionTicketById(@Param('idResolution') idResolution: number) {
    return this.ticketsService.getResolutionTicketById(idResolution);
  }

  @ApiBearerAuth()
  @Get('resolutionTickets/:idTicket')
  @Roles(Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  getAllResolutionsOfTicket(@Param('idTicket') idTicket: number) {
    return this.ticketsService.getAllResolutionsOfTicket(idTicket);
  }

  @Get('report/summary')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getTicketReport() {
    try {
      return await this.ticketsService.getTicketsReport();
    } catch (error) {
      console.error('Error en getTicketReport:', error);
      throw new HttpException(
        'Error al generar el reporte',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
