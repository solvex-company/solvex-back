import { Controller, Post, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/createTicket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create')
  createTicket(@Body() ticketData: CreateTicketDto) {
    return this.ticketsService.createTicket(ticketData);
  }
}
