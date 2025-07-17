import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity({ name: 'areas' })
export class Area {
  @PrimaryGeneratedColumn({ name: 'id_area', type: 'int' })
  id_area: number;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => Ticket, (ticket) => ticket.area)
  tickets: Ticket[];
}
