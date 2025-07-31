import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketStatus } from './statusTickets.entity';
import { Area } from './areas.entity';
import { ResolutionTicket } from './resolutionsTicket';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int' })
  id_ticket: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  closing_date: Date | null;

  @Column({ type: 'varchar', default: 'no image' })
  img_1: string;

  @Column({ type: 'varchar', default: 'no image' })
  img_2: string;

  @Column({ type: 'varchar', default: 'no image' })
  img_3: string;

  @ManyToOne(() => TicketStatus, (status) => status.tickets)
  @JoinColumn({ name: 'id_status' })
  id_status: TicketStatus;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'id_empleado' })
  id_empleado: User;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'id_helper' })
  id_helper: User;

  @ManyToOne(() => Area, (area) => area.tickets)
  @JoinColumn({ name: 'id_area' })
  area: Area;

  @OneToMany(() => ResolutionTicket, (resolution) => resolution.ticket)
  resolutions: ResolutionTicket[];
}
