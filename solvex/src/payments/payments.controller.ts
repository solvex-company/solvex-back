import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('checkout')
  async startMercadoPagoCheckout() {
    const checkoutInfo =
      await this.paymentsService.createMercadoPagoPreference();
    return checkoutInfo;
  }

  @Get('sub')
  sub() {
    return this.paymentsService.sub();
  }

  @Post('confirm')
  async confirmPayment(
    @Body() body: { payment_id: string; id_user: string; id_plan: number },
  ) {
    return this.paymentsService.confirmPayment(
      body.payment_id,
      body.id_user,
      body.id_plan,
    );
  }
}
