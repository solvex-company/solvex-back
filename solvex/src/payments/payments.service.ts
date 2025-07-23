import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;
  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('mercadoPago.accessToken')!;
    this.client = new MercadoPagoConfig({ accessToken: token });
    this.preference = new Preference(this.client);
  }

  prueba() {
    ////.create manda un request al api de mercadopago con la sesion de pago o preferencia.
    this.preference
      .create({
        body: {
          items: [
            {
              id: '1',
              title: 'Mi producto',
              quantity: 1,
              unit_price: 2000,
            },
          ],
          back_urls: {
            success: 'https://localhost:3000/success',
            failure: 'https://localhost:3000/failure',
            pending: 'https://localhost:3000/pending',
          },
          //si el pago es aprobado el usuario sera retornado al back_url de success automaticamente, caso contrario tendra que dar click manualmente en regresar al sitio
          auto_return: 'approved',
        },
      })
      .then(console.log)
      .catch(console.log);
  }
}
