import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './crons.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async getUserNotifications(@Request() req: any) {
    // req.user.id_user debe estar disponible por el AuthGuard
    return this.notificationService.getUserNotifications(req.user.id_user);
  }

  @Patch(':id/read')
  @UseGuards(AuthGuard, RolesGuard)
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }
} 