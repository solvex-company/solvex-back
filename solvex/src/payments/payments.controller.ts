import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtRequest } from 'src/auth/interfaces/jwt-request.interface';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('checkout')
  @UseGuards(AuthGuard)
  async startMercadoPagoCheckout(@Req() req: JwtRequest) {
    const userId: string = req.user.id;
    const checkoutInfo =
      await this.paymentsService.createMercadoPagoPreference(userId);
    return checkoutInfo;
  }

  @Get('sub')
  sub() {
    return this.paymentsService.sub();
  }

  @Post('webhook')
  async handleMercadoPagoWebhook(@Req() req: Request) {
    return this.paymentsService.handleMercadoPagoWebhook(req.body);
  }
}
