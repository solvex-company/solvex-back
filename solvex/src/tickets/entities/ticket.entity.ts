import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketStatus } from './ticketStatus.entity';

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

  @Column({ type: 'timestamp', nullable: true })
  closing_date: Date;

  @Column({ type: 'image', nullable: true })
  img_1: string;

  @Column({ type: 'image', nullable: true })
  img_2: string;

  @Column({ type: 'image', nullable: true })
  img_3: string;

  @ManyToOne(() => TicketStatus, (status) => status.id_status)
  @JoinColumn({ name: 'id_status' })
  id_status: TicketStatus;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'id_empleado' })
  id_empleado: User;

  @ManyToOne(() => User, (user) => user.id_user)
  @JoinColumn({ name: 'id_helper' })
  id_helper: User;
}
