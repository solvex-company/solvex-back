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
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/roles.guard';
import { resolutionTicketDto } from './dto/resolutionTicket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @Post('createTicket')
  @Roles(Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
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

  @Post('resolutionTicket')
  @Roles(Role.HELPER)
  @UseGuards(AuthGuard, RolesGuard)
  resolutionTicket(@Body() resolutionTicketDto: resolutionTicketDto) {
    return this.ticketsService.resolutionTicket(resolutionTicketDto);
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
