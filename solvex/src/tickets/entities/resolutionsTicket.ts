import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { TicketStatus } from './statusTickets.entity';

@Entity({ name: 'resolutions_ticket' })
export class ResolutionTicket {
  @PrimaryGeneratedColumn({ name: 'id_resolution_ticket', type: 'int' })
  id_resolution_ticket: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.resolutions)
  @JoinColumn({ name: 'id_ticket' })
  ticket: Ticket;

  @ManyToOne(() => TicketStatus)
  @JoinColumn({ name: 'id_status_ticket' })
  status: TicketStatus;
}
