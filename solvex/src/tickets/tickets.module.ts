import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketStatus } from './entities/statusTickets.entity';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ticket, TicketStatus]),
    FileUploadModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
