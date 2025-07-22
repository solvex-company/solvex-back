/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  UseGuards,
  Get,
  UnauthorizedException,
  Request,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TicketsService } from '../tickets/tickets.service';
import { createTicketDto } from './dto/createTicket.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Ticket } from './entities/ticket.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @Post('createTicket')
  @Roles(Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(createTicketDto)
  @ApiBody({
    description: 'Subir archivos junto con datos del ticket',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: '#/components/schemas/createTicketDto',
        },
      },
      required: ['data', 'files'],
    },
  })
  @UseInterceptors(FilesInterceptor('images', 3))
  async createTicket(
    @Request() req: any,
    @Body() createTicketData: createTicketDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.ticketsService.createTicket(
      {
        ...createTicketData,
      },
      req.user,
      files,
    );
  }

  @Get('getAreas')
  @UseGuards(AuthGuard)
  getAreas() {
    return this.ticketsService.getAreas();
  }

  @Get('getAllTickets')
  @Roles(Role.HELPER)
  @UseGuards(AuthGuard, RolesGuard)
  getAllTickets() {
    return this.ticketsService.getAllTickets();
  }

  @ApiBearerAuth()
  @Get(':ticketId')
  @Roles(Role.HELPER, Role.EMPLOYEE)
  @UseGuards(AuthGuard, RolesGuard)
  getTicketById(@Param('ticketId') ticketId: number) {
    return this.ticketsService.getTicketById(ticketId);
  }

  @Post('resolutionTicket/:id_helper')
  @Roles(Role.HELPER)
  @UseGuards(AuthGuard, RolesGuard)
  resolutionTicket(
    @Param('id_helper') id_helper: string,
    @Body() ticketData: Ticket,
  ) {
    return this.ticketsService.resolutionTicket(id_helper, ticketData);
  }
}
