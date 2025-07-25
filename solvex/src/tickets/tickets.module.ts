import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketStatus } from './entities/statusTickets.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { Area } from './entities/areas.entity';
import { ResolutionTicket } from './entities/resolutionsTicket';
import { Credentials } from 'src/users/entities/Credentials.entity';
import { MailService } from 'src/notifications/mail/mail.service';

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
  ],
  controllers: [TicketsController],
  providers: [TicketsService, MailService],
})
export class TicketsModule {}
