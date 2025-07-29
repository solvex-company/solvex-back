import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { ResolutionTicket } from 'src/tickets/entities/resolutionsTicket';
import { Roles } from 'src/users/entities/Roles.entity';
import * as cron from 'node-cron';
import { LessThan, IsNull } from 'typeorm';

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
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .leftJoinAndSelect('notification.ticket', 'ticket')
      .where('user.id_user = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
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

  // Obtiene una notificación por ID con relaciones
  async getNotificationById(notificationId: number): Promise<Notification | null> {
    return this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });
  }

  /**
   * Notifica al admin si un helper no resuelve tickets en 48h, y luego cada 24h.
   * El contador se reinicia si el helper resuelve un ticket.
   */
  async notifyAdminHelpersInactive() {
    // Buscar el rol Soporte y Admin según la base de datos
    const helperRole = await this.rolesRepository.findOne({ where: { role_name: 'Soporte' } });
    if (!helperRole) return;
    const helpers = await this.userRepository.find({ where: { role: { id_role: helperRole.id_role } } });

    const adminRole = await this.rolesRepository.findOne({ where: { role_name: 'Admin' } });
    if (!adminRole) return;
    const admins = await this.userRepository.find({ where: { role: { id_role: adminRole.id_role } } });
    if (!admins.length) return;

    const now = new Date();

    for (const helper of helpers) {
      // Buscar la última resolución de ticket de este helper
      const lastResolution = await this.resolutionTicketRepository.findOne({
        where: { id_helper: helper },
        order: { date: 'DESC' },
      });
      let lastDate = lastResolution
        ? lastResolution.date
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días atrás como fallback

      // Calcular horas desde la última resolución
      const hoursSince =
        (now.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60);
      // Primer aviso a las 48h, luego cada 24h
      if (hoursSince >= 48) {
        const avisos = Math.floor((hoursSince - 48) / 24) + 1;
        const message = `El helper ${helper.name} ${helper.lastname} no ha resuelto tickets en ${48 + (avisos - 1) * 24}hs`;
        for (const admin of admins) {
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
  }

  async notificationNewTickets24() {
    const helperRole = await this.rolesRepository.findOne({ where: { role_name: 'Soporte' } });
    if (!helperRole) return;
    const helpers = await this.userRepository.find({ where: { role: { id_role: helperRole.id_role } } });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tickets = await this.ticketRepository.find({
      where: {
        id_helper: IsNull(),
        creation_date: LessThan(twentyFourHoursAgo)
      }
    });

    if (tickets.length > 0) {
      const message = `Tienes ${tickets.length} tickets sin resolver desde hace 24 horas`;
      for (const helper of helpers) {
        const existing = await this.notificationRepository.findOne({
          where: { user: helper, message, ticket: undefined }
        });
        if (!existing) {
          await this.createNotification(helper, undefined, message);
        }
      }
    }
  }

  /**
   * Envía una notificación personalizada a todos los usuarios de un rol específico.
   * Evita notificaciones duplicadas (mismo usuario, mensaje y sin ticket asociado).
   */
  async notifyUsersByRole(roleName: string, message: string) {
    const role = await this.rolesRepository.findOne({ where: { role_name: roleName } });
    if (!role) throw new Error('Role not found');
    const users = await this.userRepository.find({ where: { role } });
    let notified = 0;
    for (const user of users) {
      const existing = await this.notificationRepository.findOne({
        where: { user, message, ticket: undefined },
      });
      if (!existing) {
        await this.createNotification(user, undefined, message);
        notified++;
      }
    }
    return { notified };
  }
}
