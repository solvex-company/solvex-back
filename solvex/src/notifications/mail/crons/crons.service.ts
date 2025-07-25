import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Crea una notificación interna
  async createNotification(user: User, ticket: Ticket, message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user,
      ticket,
      message,
      read: false,
    });
    return this.notificationRepository.save(notification);
  }

  // Obtiene todas las notificaciones de un usuario
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id_user: userId } },
      relations: ['user', 'ticket'],
      order: { createdAt: 'DESC' },
    });
  }

  // Marca una notificación como leída
  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (notification) {
      notification.read = true;
      return this.notificationRepository.save(notification);
    }
    throw new Error('Notification not found');
  }

}
