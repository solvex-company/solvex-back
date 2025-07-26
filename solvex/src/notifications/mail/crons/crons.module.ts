import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './crons.service';
import { NotificationController } from './crons.controller';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { ResolutionTicket } from 'src/tickets/entities/resolutionsTicket';
import { Roles } from 'src/users/entities/Roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Ticket, User, ResolutionTicket, Roles])],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {} 