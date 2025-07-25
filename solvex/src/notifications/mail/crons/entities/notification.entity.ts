import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity({ name: 'notificaciones' })
export class Notification {
  @PrimaryGeneratedColumn({ name: 'id_notificacion', type: 'int' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'id_ticket' })
  ticket: Ticket;

  @Column({ name: 'mensaje', type: 'varchar', length: 255, nullable: false })
  message: string;

  @Column({ name: 'leida', type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  createdAt: Date;
}
