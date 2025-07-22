import { Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('MERCADO_PAGO') private readonly mpClient: MercadoPagoConfig,
  ) {}
  async createPaymentPreference(
    amount: number,
    title: string,
  ): Promise<string> {
    const preference = {
      items: [
        {
          id: 'item-1',
          title: title,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: amount,
        },
      ],
      back_urls: {
        success: 'http://localhost:4000/success',
      },
      auto_return: 'approved',
    };

    const preferenceClient = new Preference(this.mpClient);
    const response = await preferenceClient.create({ body: preference });
    if (!response.init_point) {
      throw new Error(
        'Failed to create payment preference: init_point is undefined',
      );
    }
    return response.init_point;
  }
}
