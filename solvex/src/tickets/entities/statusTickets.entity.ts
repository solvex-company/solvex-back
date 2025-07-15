import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity({ name: 'statusTicketsId' })
export class TicketStatus {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_status: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.id_status)
  tickets: Ticket[];
}
