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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TicketsService } from '../tickets/tickets.service';
import { createTicketDto } from './dto/createTicket.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('createTicket')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  getAllTickets() {
    return this.ticketsService.getAllTickets();
  }
}
