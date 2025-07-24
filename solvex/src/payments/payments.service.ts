import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, PreApproval, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;
  private readonly preapproval: PreApproval;
  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('mercadoPago.accessToken')!;
    this.client = new MercadoPagoConfig({ accessToken: token });
    this.preference = new Preference(this.client);
    this.preapproval = new PreApproval(this.client);
  }

  async createMercadoPagoPreference() {
    try {
      ////.create manda un request al API de Mercado Pago con la preferencia (sesion de pago).
      const preferenceResponse = await this.preference.create({
        body: {
          items: [
            {
              id: '1',
              title: 'Acceso al chat de soporte',
              quantity: 1,
              unit_price: 5,
              currency_id: 'USD',
            },
          ],
          back_urls: {
            success: 'https://localhost:3000/success',
            failure: 'https://localhost:3000/failure',
            pending: 'https://localhost:3000/pending',
          },
          //si el pago es aprobado el usuario sera retornado al back_url de success automaticamente, caso contrario tendra que dar click manualmente en regresar al sitio
          auto_return: 'approved',
          payment_methods: {
            excluded_payment_types: [
              {
                id: 'ticket',
              },
            ],
          },
        },
      });

      const { id, init_point } = preferenceResponse;

      if (!id || !init_point) {
        throw new Error(
          'Mercado Pago preference did not contain id or init_point',
        );
      }
      return { preferenceId: id, paymentUrl: init_point };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create Mercado Pago preference',
        { cause: error },
      );
    }
  }

  ///// prueba suscripcion, no borrar
  // async sub() {
  //   await this.preapproval
  //     .create({
  //       body: {
  //         reason: 'Premium Membership',
  //         auto_recurring: {
  //           frequency: 1,
  //           frequency_type: 'months',
  //           transaction_amount: 50,
  //           currency_id: 'ARS', // or 'USD'
  //         },
  //         back_url: 'https://your-site.com/subscription/approved',
  //         payer_email: 'pepito@faklsdfa.com', // Optional: pre-fill payer
  //       },
  //     })
  //     .then(console.log)
  //     .catch(console.log);
  // }
}
