import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from '../users/entities/user.entity';
import { TicketStatus } from './entities/statusTickets.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { Area } from './entities/areas.entity';
import { ResolutionTicket } from './entities/resolutionsTicket';
import { Credentials } from '../users/entities/Credentials.entity';
import { MailModule } from '../notifications/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ticket,
      TicketStatus,
      Area,
      ResolutionTicket,
      Credentials,
    ]),
    FileUploadModule,
    MailModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
