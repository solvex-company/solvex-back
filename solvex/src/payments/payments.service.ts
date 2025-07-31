import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MercadoPagoConfig,
  Preference,
  Payment as MpPayment,
  PreApproval,
} from 'mercadopago';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Payment } from './entities/entity.payment';
// import { Plan } from './entities/entity.plan';
// import { Subscription } from './entities/entity.subscription';
import fetch from 'node-fetch';
import { MailService } from 'src/notifications/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;
  private readonly paymentClient: MpPayment;
  private readonly preapproval: PreApproval;
  private readonly webHookUrl: string;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    const token = this.configService.get<string>('mercadoPago.accessToken')!;
    this.webHookUrl = this.configService.get<string>('mercadoPago.webHookUrl')!;
    this.client = new MercadoPagoConfig({ accessToken: token });
    this.preference = new Preference(this.client);
    this.paymentClient = new MpPayment(this.client);
    this.preapproval = new PreApproval(this.client);
  }
  ////verificar si existe un preference activo si existe redirigir , si fecha, poner como expirado
  //// si el pago esta pending, poner pago pendiente,
  //// si el pago esta rejected seguir

  async userHasApprovedPayment(userId: string): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({
      where: { userId: userId, status: 'approved' },
    });
    return !!payment;
  }

  async approvedPaymentToken(user) {
    const userExists = await this.userRepository.findOne({
      where: { id_user: user.id_user },
    });
    if (!userExists) {
      throw new Error('User not found');
    }

    const hasPaid = await this.userHasApprovedPayment(user.id_user);

    const payload = {
      id_user: user.id_user,
      email: user.email,
      id_role: user.id_role,
      paymentApproved: !!hasPaid,
    };

    const token = this.jwtService.sign(payload);

    return { paymentApproved: !!hasPaid, token: token };
  }

  async createMercadoPagoPreference(userId: string) {
    try {
      const hasPaid = await this.userHasApprovedPayment(userId);
      if (hasPaid) {
        throw new BadRequestException('El usuario ya ha realizado el pago.');
      }

      const pendingPayment = await this.paymentRepository.findOne({
        where: { userId: userId, status: 'pending' },
      });
      if (pendingPayment) {
        throw new BadRequestException('El usuario tiene un pago pendiente.');
      }

      const existingPreference = await this.paymentRepository.findOne({
        where: { userId, status: 'created' },
      });

      if (
        existingPreference &&
        new Date() < existingPreference.init_point_expiration_date
      ) {
        return {
          preferenceId: existingPreference.mp_preference_id,
          paymentUrl: existingPreference.init_point,
        };
      } else if (existingPreference) {
        await this.paymentRepository.update(
          { id_payment: existingPreference.id_payment },
          { status: 'expired' },
        );
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes later
      ////.create manda un request al API de Mercado Pago con la preferencia (sesion de pago).
      const preferenceResponse = await this.preference.create({
        body: {
          items: [
            {
              id: '1',
              title: 'Habilitacion de notificaciones',
              quantity: 1,
              unit_price: 5,
              currency_id: 'USD',
            },
          ],
          back_urls: {
            success: 'https://solvex-front.vercel.app/success',
            failure: 'https://solvex-front.vercel.app/failure',
            pending: 'https://solvex-front.vercel.app/pending',
          },
          expiration_date_from: now.toISOString(),
          expiration_date_to: expiresAt.toISOString(),
          //si el pago es aprobado el usuario sera retornado al back_url de success automaticamente, caso contrario tendra que dar click manualmente en regresar al sitio
          auto_return: 'approved',
          payment_methods: {
            excluded_payment_types: [
              {
                id: 'ticket',
              },
            ],
          },
          // URL pública donde Mercado Pago enviará el webhook
          notification_url: this.webHookUrl,
        },
      });

      const { id, init_point, items } = preferenceResponse;

      if (!id || !init_point) {
        throw new Error(
          'Mercado Pago preference did not contain id or init_point',
        );
      }
      if (!items || items.length === 0) {
        throw new Error('No items found in Mercado Pago preference');
      }
      const user = await this.paymentRepository.manager.findOne(User, {
        where: { id_user: userId },
        relations: ['credentials'],
      });
      if (!user) {
        throw new Error('User not found when creating payment');
      }
      const newPayment: Payment = this.paymentRepository.create({
        mp_payment_id: null,
        init_point: init_point,
        init_point_expiration_date: new Date(Date.now() + 15 * 60 * 1000), // expires in 15 min
        amount: items[0].unit_price,
        currency: items[0].currency_id ?? 'USD',
        status: 'created',
        payment_date: null,
        mp_preference_date: new Date(),
        mp_preference_id: id,
        userId: user.id_user, // Asigna el userId correctamente
      } as unknown as Payment);

      await this.paymentRepository.save(newPayment);

      if (user.credentials?.email) {
        try {
          await this.mailService.sendPaymentCreationEmail(
            user.credentials.email,
            {
              paymentUrl: init_point,
              amount: items[0].unit_price,
              currency: items[0].currency_id ?? 'USD',
              expiration: expiresAt.toLocaleString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          );
        } catch (error) {
          this.logger.error('Error sending payment creation email', {
            error: error.message,
            stack: error.stack,
            email: user.credentials.email,
          });
        }
      }
      return { preferenceId: id, paymentUrl: init_point };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create Mercado Pago preference',
        { cause: error },
      );
    }
  }

  async sub() {
    await this.preapproval
      .create({
        body: {
          reason: 'Premium Membership',
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: 50,
            currency_id: 'ARS', // or 'USD'
          },
          back_url: 'https://your-site.com/subscription/approved',
          payer_email: 'pepito@faklsdfa.com', // Optional: pre-fill payer
        },
      })
      .then(console.log)
      .catch(console.log);
  }

  // Procesa los webhooks de Mercado Pago y actualiza el estado del pago en la base de datos
  async handleMercadoPagoWebhook(data: any): Promise<any> {
    // 1. Si el webhook es de tipo merchant_order, busca el mp_preference_id y actualiza solo el registro correcto
    if (data?.topic === 'merchant_order' || data?.type === 'merchant_order') {
      let orderId: string | undefined = undefined;
      if (
        data?.resource &&
        typeof data.resource === 'string' &&
        data.resource.includes('/merchant_orders/')
      ) {
        orderId = data.resource.split('/merchant_orders/')[1];
      } else if (data?.id) {
        orderId = String(data.id);
      }
      if (orderId) {
        // Consulta a Mercado Pago para obtener los detalles de la orden y el preference_id
        const accessToken = this.configService.get<string>(
          'mercadoPago.accessToken',
        );
        const response = await fetch(
          `https://api.mercadopago.com/merchant_orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const orderInfo = await response.json();
        const preferenceId = orderInfo?.preference_id;
        if (preferenceId) {
          const payment = await this.paymentRepository.findOne({
            where: { mp_preference_id: String(preferenceId) },
          });
          if (payment) {
            payment.mp_order_id = orderId;
            await this.paymentRepository.save(payment);
          }
        }
      }
      return { received: true };
    }

    // 2. Si el webhook es de tipo payment, actualiza el estado del pago usando mp_order_id
    let paymentId: string | undefined = undefined;
    if (data?.data?.id) {
      paymentId = data.data.id;
    } else if (data?.resource) {
      if (/^\d+$/.test(data.resource)) {
        paymentId = data.resource;
      } else if (
        typeof data.resource === 'string' &&
        data.resource.includes('/payments/')
      ) {
        paymentId = data.resource.split('/payments/')[1];
      }
    } else if (data?.id) {
      paymentId = data.id;
    }
    if (!paymentId) {
      return { received: false, message: 'No payment ID found in webhook' };
    }
    try {
      // Consulta a Mercado Pago para obtener los detalles completos del pago
      const paymentInfo = await this.paymentClient.get({ id: paymentId });
      // Obtiene el order.id (merchant order) del pago
      const orderId = paymentInfo.order?.id;
      if (!orderId) {
        return {
          received: false,
          message: 'No order ID found in payment info',
        };
      }
      // Busca el registro de pago por mp_order_id
      let payment = await this.paymentRepository.findOne({
        where: { mp_order_id: String(orderId) },
      });
      if (!payment) {
        return { received: false, message: 'Payment not found in database' };
      }

      const previousStatus = payment.status;
      // Actualiza el estado, el ID de pago y la fecha de pago en la base de datos
      payment.status = paymentInfo.status ?? 'unknown';
      payment.mp_payment_id = String(paymentId);
      payment.payment_date = paymentInfo.date_approved
        ? new Date(paymentInfo.date_approved)
        : new Date();
      await this.paymentRepository.save(payment);

      if (payment.status === 'approved' && previousStatus !== 'approved') {
        const user = await this.paymentRepository.manager.findOne(User, {
          where: { id_user: payment.userId },
          relations: ['credentials'],
        });
        if (user?.credentials?.email) {
          await this.mailService
            .sendPaymentApprovalEmail(user.credentials.email, {
              amount: payment.amount,
              currency: payment.currency,
              paymentDate: payment.payment_date.toLocaleString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            })
            .catch((error) => {
              console.error('Error completo al enviar:', error);
              this.logger.error('Error sending payment approval email', error);
            });
        }
      }

      return { received: true };
    } catch (error) {
      return {
        received: false,
        message: 'Error processing Mercado Pago webhook',
      };
    }
  }
}
