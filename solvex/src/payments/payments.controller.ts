import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

<<<<<<< HEAD
  @Get('checkout')
  createPayment() {
=======
  @Get()
  prueba() {
>>>>>>> d08333e45e563bad758d1479c0c71c6b2a87042c
    return this.paymentsService.prueba();
  }
}
