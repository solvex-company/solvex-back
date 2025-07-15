import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './createTicket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}
