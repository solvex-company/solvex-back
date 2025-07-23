import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('checkout')
  createPayment() {
    return this.paymentsService.prueba();
  }
}
