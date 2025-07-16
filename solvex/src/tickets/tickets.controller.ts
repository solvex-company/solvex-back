/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TicketsService } from '../tickets/tickets.service';
import { createTicketDto } from './dto/createTicket.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create-with-images')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 3))
  async createWithImages(
    @Request() req: { user: { sub: string } },
    @Body() createTicketData: createTicketDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const id_empleado = req.user.sub;

    return this.ticketsService.createTicket(
      {
        ...createTicketData,
        id_empleado,
      },
      files,
    );
  }
}
