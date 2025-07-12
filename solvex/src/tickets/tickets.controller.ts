import { Controller } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // @Post('create')
  // createTicket(@Body() ticketData: CreateTicketDto) {
  //   return this.ticketsService.createTicket(ticketData);
  // }
}
