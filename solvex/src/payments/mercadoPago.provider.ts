// import { ConfigService } from '@nestjs/config';
// import { Provider } from '@nestjs/common';
// import { MercadoPagoConfig } from 'mercadopago';

// export const MercadoPagoProvider: Provider = {
//   provide: 'MERCADO_PAGO',
//   useFactory: (configService: ConfigService) => {
//     const accessToken = configService.get<string>(
//       'process.env.MP_ACCESS_TOKEN',
//     );

//     if (!accessToken) {
//       throw new Error('MercadoPago access token is not defined');
//     }

//     const mpClient = new MercadoPagoConfig({
//       accessToken: accessToken,
//     });

//     return mpClient;
//   },
//   inject: [ConfigService],
// };
