import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
  ForbiddenException,
  Body,
  Post,
} from '@nestjs/common';
import { NotificationService } from './crons.service';
import { AuthGuard } from 'src/auth/auth.guard';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { NotificationRolesGuard } from './notification-roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
// import { Roles } from 'src/decorators/roles.decorators';
// import { Role } from 'src/roles.enum';

@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Obtener notificaciones del usuario autenticado (protegido solo por AuthGuard)
  @Roles(Role.ADMIN, Role.HELPER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Activar notificaciones',
    description: `
      Para activar las notificaciones en modo de prueba se necesita primero correr
      la ruta de test-cron
    `,
  })
  @Get()
  async getUserNotifications(@Request() req: any) {
    return this.notificationService.getUserNotifications(req.user.id_user);
  }

  // Marcar una notificación como leída (protegido solo por AuthGuard)
  @UseGuards(AuthGuard)
  @Patch(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    // Validar que la notificación pertenece al usuario autenticado
    const notification = await this.notificationService.getNotificationById(
      Number(id),
    );
    if (!notification || notification.user.id_user !== req.user.id_user) {
      throw new ForbiddenException(
        'No tienes permisos para marcar esta notificación como leída',
      );
    }
    return this.notificationService.markAsRead(Number(id));
  }

  // Ejecutar manualmente el cron de notificaciones (protegido solo por AuthGuard)
  @UseGuards(AuthGuard)
  @Get('test-cron')
  async testCron(@Request() req: any) {
    await this.notificationService.notifyAdminHelpersInactive();
    await this.notificationService.notificationNewTickets24();
    return { message: 'CRON ejecutado manualmente' };
  }

  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'Datos para la notificación',
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          example: 'Admin',
          description: 'Rol de los usuarios a notificar',
        },
        message: {
          type: 'string',
          example: 'Mensaje importante para administradores',
          description: 'Contenido de la notificación',
        },
      },
      required: ['role', 'message'],
    },
  })
  @Post('notify-by-role')
  async notifyByRole(@Body() body: { role: string; message: string }) {
    return this.notificationService.notifyUsersByRole(body.role, body.message);
  }
}
