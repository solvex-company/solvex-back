import { Controller, Get } from '@nestjs/common';
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
}
