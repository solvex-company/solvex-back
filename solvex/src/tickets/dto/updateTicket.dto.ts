import { PartialType } from '@nestjs/swagger';
import { createTicketDto } from './createTicket.dto';

export class UpdateTicketDto extends PartialType(createTicketDto) {}
