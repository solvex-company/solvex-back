import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { ResolutionTicket } from 'src/tickets/entities/resolutionsTicket';
import { Roles } from 'src/users/entities/Roles.entity';
import * as cron from 'node-cron';
import { LessThan, IsNull, Like } from 'typeorm';

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
    cron.schedule(
      '10 16 * * *',
      () => {
        this.notifyAdminHelpersInactive();
      },
      {
        timezone: 'America/Argentina/Buenos_Aires',
      },
    );

    cron.schedule(
      '10 16 * * *',
      () => {
        this.notificationNewTickets24();
      },
      {
        timezone: 'America/Argentina/Buenos_Aires',
      },
    );
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
    const allNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .leftJoinAndSelect('notification.ticket', 'ticket')
      .where('user.id_user = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

    // Agrupar notificaciones de inactividad por helper y tomar solo la más reciente
    const helperNotifications = new Map<string, Notification>();
    const otherNotifications: Notification[] = [];

    for (const notification of allNotifications) {
      // Si es una notificación de inactividad de helper
      if (notification.message && notification.message.includes('no ha resuelto tickets en 2 dias o más')) {
        // Extraer el nombre del helper del mensaje
        const match = notification.message.match(/El helper (.+?) no ha resuelto tickets/);
        if (match) {
          const helperName = match[1];
          // Solo guardar si no existe una notificación más reciente para este helper
          // Como ya están ordenadas por fecha DESC, la primera que encontremos será la más reciente
          if (!helperNotifications.has(helperName)) {
            helperNotifications.set(helperName, notification);
          }
        }
      } else {
        // Para otras notificaciones, incluirlas todas
        otherNotifications.push(notification);
      }
    }

    // Combinar notificaciones de helpers (solo la más reciente) con otras notificaciones
    const result = [...helperNotifications.values(), ...otherNotifications];
    
    // Ordenar por fecha de creación (más reciente primero)
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
  async getNotificationById(
    notificationId: number,
  ): Promise<Notification | null> {
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
    const helperRole = await this.rolesRepository.findOne({
      where: { role_name: 'Soporte' },
    });
    if (!helperRole) return;
    const helpers = await this.userRepository.find({
      where: { role: { id_role: helperRole.id_role } },
    });

    const adminRole = await this.rolesRepository.findOne({
      where: { role_name: 'Admin' },
    });
    if (!adminRole) return;
    const admins = await this.userRepository.find({
      where: { role: { id_role: adminRole.id_role } },
    });
    if (!admins.length) return;

    const now = new Date();

    for (const helper of helpers) {
      // Buscar la última resolución de ticket de este helper
      const lastResolution = await this.resolutionTicketRepository.findOne({
        where: { id_helper: { id_user: helper.id_user } },
        order: { date: 'DESC' },
      });
      let lastDate = lastResolution
        ? lastResolution.date
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días atrás como fallback

      // Calcular horas desde la última resolución
      const hoursSince =
        (now.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60);
      
      // Si está inactivo por 48 horas o más, crear notificación
      if (hoursSince >= 48) {
        const message = `El helper ${helper.name} ${helper.lastname} no ha resuelto tickets en 2 dias o más`;
        for (const admin of admins) {
          // Verificar si ya existe una notificación de inactividad para este helper
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
    const helperRole = await this.rolesRepository.findOne({
      where: { role_name: 'Soporte' },
    });
    if (!helperRole) return;
    const helpers = await this.userRepository.find({
      where: { role: { id_role: helperRole.id_role } },
    });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tickets = await this.ticketRepository.find({
      where: {
        id_helper: IsNull(),
        creation_date: LessThan(twentyFourHoursAgo),
      },
    });

    // Eliminar notificaciones existentes de tickets sin resolver
    for (const helper of helpers) {
      const existingNotifications = await this.notificationRepository.find({
        where: { 
          user: helper, 
          ticket: undefined,
          message: Like('%tickets sin resolver desde hace 24 horas%')
        },
      });
      
      if (existingNotifications.length > 0) {
        const notificationIds = existingNotifications.map(n => n.id);
        await this.notificationRepository.delete(notificationIds);
      }
    }

    // Crear nuevas notificaciones con el conteo actualizado
    if (tickets.length > 0) {
      const message = `Tienes ${tickets.length} tickets sin resolver desde hace 24 horas`;
      for (const helper of helpers) {
        await this.createNotification(helper, undefined, message);
      }
    }
  }

  /**
   * Envía una notificación personalizada a todos los usuarios de un rol específico.
   * Evita notificaciones duplicadas (mismo usuario, mensaje y sin ticket asociado).
   */
  async notifyUsersByRole(roleName: string, message: string) {
    const role = await this.rolesRepository.findOne({
      where: { role_name: roleName },
    });
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

  /**
   * Elimina las notificaciones de inactividad de un helper cuando resuelve un ticket
   */
  async clearHelperInactivityNotifications(helperId: string) {
    const helper = await this.userRepository.findOne({
      where: { id_user: helperId },
    });
    
    if (!helper) return { deletedCount: 0 };

    const adminRole = await this.rolesRepository.findOne({
      where: { role_name: 'Admin' },
    });
    
    if (!adminRole) return { deletedCount: 0 };

    const admins = await this.userRepository.find({
      where: { role: { id_role: adminRole.id_role } },
    });

    let deletedCount = 0;

    for (const admin of admins) {
      const notificationsToDelete = await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user = :adminId', { adminId: admin.id_user })
        .andWhere('notification.ticket IS NULL')
        .andWhere('notification.message LIKE :messagePattern', { 
          messagePattern: `%${helper.name} ${helper.lastname} no ha resuelto tickets en 2 dias o más%` 
        })
        .getMany();

      if (notificationsToDelete.length > 0) {
        const notificationIds = notificationsToDelete.map(n => n.id);
        const deletedNotifications = await this.notificationRepository.delete(notificationIds);
        deletedCount += deletedNotifications.affected || 0;
      }
    }

    return { deletedCount };
  }

  /**
   * Limpia notificaciones duplicadas de inactividad, manteniendo solo la más reciente por helper
   */
  async cleanDuplicateInactivityNotifications() {
    const adminRole = await this.rolesRepository.findOne({
      where: { role_name: 'Admin' },
    });
    
    if (!adminRole) return { deletedCount: 0 };

    const admins = await this.userRepository.find({
      where: { role: { id_role: adminRole.id_role } },
    });

    let totalDeleted = 0;

    for (const admin of admins) {
      // Obtener todas las notificaciones de inactividad del admin
      const inactivityNotifications = await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user = :adminId', { adminId: admin.id_user })
        .andWhere('notification.ticket IS NULL')
        .andWhere('notification.message LIKE :messagePattern', { 
          messagePattern: '%no ha resuelto tickets en 2 dias o más%' 
        })
        .orderBy('notification.createdAt', 'DESC')
        .getMany();

      // Agrupar por helper y mantener solo la más reciente
      const helperNotifications = new Map<string, Notification>();
      const notificationsToDelete: Notification[] = [];

      for (const notification of inactivityNotifications) {
        const match = notification.message.match(/El helper (.+?) no ha resuelto tickets/);
        if (match) {
          const helperName = match[1];
          if (helperNotifications.has(helperName)) {
            // Ya existe una notificación más reciente para este helper, marcar para eliminar
            notificationsToDelete.push(notification);
          } else {
            // Es la primera (más reciente) para este helper
            helperNotifications.set(helperName, notification);
          }
        }
      }

      // Eliminar las notificaciones duplicadas
      if (notificationsToDelete.length > 0) {
        const notificationIds = notificationsToDelete.map(n => n.id);
        const deletedNotifications = await this.notificationRepository.delete(notificationIds);
        totalDeleted += deletedNotifications.affected || 0;
      }
    }

    return { deletedCount: totalDeleted };
  }

  /**
   * Limpia las notificaciones de tickets sin resolver cuando se asignan tickets a helpers
   */
  async clearTicketsWithoutResolverNotifications() {
    const helperRole = await this.rolesRepository.findOne({
      where: { role_name: 'Soporte' },
    });
    
    if (!helperRole) return { deletedCount: 0 };

    const helpers = await this.userRepository.find({
      where: { role: { id_role: helperRole.id_role } },
    });

    let totalDeleted = 0;

    for (const helper of helpers) {
      const notificationsToDelete = await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user = :helperId', { helperId: helper.id_user })
        .andWhere('notification.ticket IS NULL')
        .andWhere('notification.message LIKE :messagePattern', { 
          messagePattern: '%tickets sin resolver desde hace 24 horas%' 
        })
        .getMany();

      if (notificationsToDelete.length > 0) {
        const notificationIds = notificationsToDelete.map(n => n.id);
        const deletedNotifications = await this.notificationRepository.delete(notificationIds);
        totalDeleted += deletedNotifications.affected || 0;
      }
    }

    return { deletedCount: totalDeleted };
  }
}
