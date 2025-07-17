import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
// import { MercadoPagoProvider } from './mercadoPago.provider';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService /*, MercadoPagoProvider*/],
})
export class PaymentsModule {}
