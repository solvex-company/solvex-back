/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtRequest } from 'src/auth/interfaces/jwt-request.interface';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @Get('checkout')
  @UseGuards(AuthGuard)
  async startMercadoPagoCheckout(@Req() req: JwtRequest) {
    const userId: string = req.user.id_user;
    const checkoutInfo =
      await this.paymentsService.createMercadoPagoPreference(userId);
    return checkoutInfo;
  }

  @ApiExcludeEndpoint()
  @Get('sub')
  sub() {
    return this.paymentsService.sub();
  }

  @Post('webhook')
  @ApiOperation({
    description: `
      Mercado Pago hace un request a esta ruta una vez que cambia el estado del pago. 
      El servicio luego procede a actualizar los datos del pago en la base de datos.
       *No es posible probar esta ruta en Swagger
    `,
  })
  async handleMercadoPagoWebhook(@Req() req: Request) {
    return this.paymentsService.handleMercadoPagoWebhook(req.body);
  }

  @ApiBearerAuth()
  @Get('is-approved')
  @UseGuards(AuthGuard)
  async approvedPaymentToken(@Req() req: JwtRequest) {
    const user: any = req.user;
    return await this.paymentsService.approvedPaymentToken(user);
  }
}
