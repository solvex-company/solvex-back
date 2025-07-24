import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { TicketStatus } from './statusTickets.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'resolutions_ticket' })
export class ResolutionTicket {
  @PrimaryGeneratedColumn({ name: 'id_resolution_ticket', type: 'int' })
  id_resolution_ticket: number;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @OneToMany(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'id_helper' })
  id_helper: User;

  @ManyToOne(() => Ticket, (ticket) => ticket.resolutions)
  @JoinColumn({ name: 'id_ticket' })
  ticket: Ticket;

  @ManyToOne(() => TicketStatus)
  @JoinColumn({ name: 'id_status_ticket' })
  status: TicketStatus;
}
