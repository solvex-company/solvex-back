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
  }

  // Crea una notificación interna
  async createNotification(user: User, ticket: Ticket | undefined, message: string): Promise<Notification> {
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

  /**
   * Notifica al admin si un helper no resuelve tickets en 48h, y luego cada 24h.
   * El contador se reinicia si el helper resuelve un ticket.
   */
  async notifyAdminHelpersInactive() {
    console.log('🔍 Iniciando verificación de inactividad de helpers...');
    
    // Buscar el rol Soporte y Admin según la base de datos
    const helperRole = await this.rolesRepository.findOne({ where: { role_name: 'Soporte' } });
    if (!helperRole) {
      console.log('❌ No se encontró el rol Soporte');
      return;
    }
    console.log('✅ Rol Soporte encontrado:', helperRole.role_name);
    
    const helpers = await this.userRepository.find({ where: { role: helperRole } });
    console.log(`📋 Encontrados ${helpers.length} helpers`);

    const adminRole = await this.rolesRepository.findOne({ where: { role_name: 'Admin' } });
    if (!adminRole) {
      console.log('❌ No se encontró el rol Admin');
      return;
    }
    console.log('✅ Rol Admin encontrado:', adminRole.role_name);
    
    const admin = await this.userRepository.findOne({ where: { role: adminRole } });
    if (!admin) {
      console.log('❌ No se encontró ningún usuario Admin');
      return;
    }
    console.log('✅ Admin encontrado:', admin.name);

    const now = new Date();

    for (const helper of helpers) {
      console.log(`\n🔍 Verificando helper: ${helper.name} ${helper.lastname}`);
      
      // Buscar la última resolución de ticket de este helper
      const lastResolution = await this.resolutionTicketRepository.findOne({
        where: { id_helper: helper },
        order: { date: 'DESC' },
      });
      let lastDate = lastResolution ? lastResolution.date : helper['createdAt'] || helper['creation_date'] || new Date(0);

      // Calcular horas desde la última resolución
      const hoursSince = (now.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60);
      console.log(`⏰ Horas desde última resolución: ${hoursSince.toFixed(2)}`);
      
      // Primer aviso a las 48h, luego cada 24h
      if (hoursSince >= 48) {
        const avisos = Math.floor((hoursSince - 48) / 24) + 1;
        const message = `El helper ${helper.name} ${helper.lastname} no ha resuelto tickets en ${48 + (avisos - 1) * 24}hs`;
        console.log(`📝 Mensaje a crear: ${message}`);
        
        const existing = await this.notificationRepository.findOne({
          where: {
            user: admin,
            ticket: undefined,
            message,
          },
        });
        
        if (!existing) {
          console.log('✅ Creando nueva notificación...');
          try {
            const notification = await this.createNotification(admin, undefined, message);
            console.log('✅ Notificación creada exitosamente:', notification.id);
          } catch (error) {
            console.error('❌ Error al crear notificación:', error);
          }
        } else {
          console.log('⏭️ Notificación ya existe, saltando...');
        }
      } else {
        console.log('⏰ Helper aún no cumple las 48 horas de inactividad');
      }
    }
    console.log('🏁 Verificación de inactividad completada\n');
  }
}
