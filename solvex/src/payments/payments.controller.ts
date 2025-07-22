import { Controller, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('checkout')
  async createPayment(
    @Query('amount') amount: number,
    @Query('title') title: string,
  ) {
    const url = await this.paymentsService.createPaymentPreference(
      amount,
      title || 'Plan Basico',
    );
    return { init_point: url };
  }
}
