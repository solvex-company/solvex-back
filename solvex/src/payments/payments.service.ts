import { Injectable } from '@nestjs/common';
<<<<<<< HEAD
=======
import { ConfigService } from '@nestjs/config';
>>>>>>> d08333e45e563bad758d1479c0c71c6b2a87042c
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
<<<<<<< HEAD
  constructor() {} // @Inject('MERCADO_PAGO') private readonly mpClient: MercadoPagoConfig,
  client = new MercadoPagoConfig({
    accessToken:
      'APP_USR-5372043080270248-071710-1654fdad50fa9e4a557b269b264cfdef-2567481644',
  });
  preference = new Preference(this.client);
=======
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;
  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('mercadoPago.accessToken')!;
    this.client = new MercadoPagoConfig({ accessToken: token });
    this.preference = new Preference(this.client);
  }

>>>>>>> d08333e45e563bad758d1479c0c71c6b2a87042c
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
