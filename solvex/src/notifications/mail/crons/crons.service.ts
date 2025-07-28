import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { ResolutionTicket } from 'src/tickets/entities/resolutionsTicket';
import { Roles } from 'src/users/entities/Roles.entity';
import * as cron from 'node-cron';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResolutionTicket)
    private readonly resolutionTicketRepository: Repository<ResolutionTicket>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  // Ejecuta el cron cada hora para verificar inactividad de helpers
  onModuleInit() {
    cron.schedule('0 * * * *', () => {
      this.notifyAdminHelpersInactive();
    });

    cron.schedule('0 0 * * *', () => {
      this.notificationNewTickets24();
    });
  }

  // Crea una notificación interna
  async createNotification(
    user: User,
    ticket: Ticket | undefined,
    message: string,
  ): Promise<Notification> {
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
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
    if (notification) {
      notification.read = true;
      return this.notificationRepository.save(notification);
    }
    throw new Error('Notification not found');
  }

  /**
   * Notifica al admin si un helper no resuelve tickets en 48h, y luego cada 24h.
   * El contador se reinicia si el helper resuelve un ticket.
   */
  async notifyAdminHelpersInactive() {
    // Buscar el rol Soporte y Admin según la base de datos
    const helperRole = await this.rolesRepository.findOne({
      where: { role_name: 'Soporte' },
    });
    if (!helperRole) return;
    const helpers = await this.userRepository.find({
      where: { role: helperRole },
    });

    const adminRole = await this.rolesRepository.findOne({
      where: { role_name: 'Admin' },
    });
    if (!adminRole) return;
    const admin = await this.userRepository.findOne({
      where: { role: adminRole },
    });
    if (!admin) return;

    const now = new Date();

    for (const helper of helpers) {
      // Buscar la última resolución de ticket de este helper
      const lastResolution = await this.resolutionTicketRepository.findOne({
        where: { id_helper: helper },
        order: { date: 'DESC' },
      });
      let lastDate = lastResolution
        ? lastResolution.date
        : helper['createdAt'] || helper['creation_date'] || new Date(0);

      // Calcular horas desde la última resolución
      const hoursSince =
        (now.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60);
      // Primer aviso a las 48h, luego cada 24h
      if (hoursSince >= 48) {
        const avisos = Math.floor((hoursSince - 48) / 24) + 1;
        const message = `El helper ${helper.name} ${helper.lastname} no ha resuelto tickets en ${48 + (avisos - 1) * 24}hs`;
        const existing = await this.notificationRepository.findOne({
          where: {
            user: admin,
            ticket: undefined,
            message,
          },
        });
        if (!existing) {
          await this.createNotification(admin, undefined, message);
        }
      }
    }
  }

  async notificationNewTickets24() {
    const helpers: User[] = await this.userRepository.find();

    const Tickets: Ticket[] = await this.ticketRepository.find();

    const ticketsWihoOutResolution: Ticket[] = Tickets.filter(
      (ticket) => !ticket.id_helper,
    );

    let totalTicketNew = 0;

    totalTicketNew += ticketsWihoOutResolution.length;

    if (totalTicketNew > 0) {
      const message = `Tienes ${totalTicketNew} tickets sin resolver desde hace 24 horas`;

      for (const helper of helpers) {
        await this.createNotification(helper, undefined, message);
      }
    }
  }
}
