import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ticket_status' })
export class TicketStatus {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_status: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  status_name: string;
}
