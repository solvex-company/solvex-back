import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity({ name: 'state' })
export class TicketStatus {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_status: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @OneToMany(() => Ticket, (ticket) => ticket.id_status)
  tickets: Ticket[];
}
