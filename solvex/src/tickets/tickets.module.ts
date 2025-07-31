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
import { NotificationService } from '../notifications/crons/crons.service';
import { Notification } from '../notifications/crons/entities/notification.entity';
import { Roles } from '../users/entities/Roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ticket,
      TicketStatus,
      Area,
      ResolutionTicket,
      Credentials,
      Notification,
      Roles,
    ]),
    FileUploadModule,
    MailModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, NotificationService],
})
export class TicketsModule {}
