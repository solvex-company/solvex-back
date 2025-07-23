import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MercadoPagoConfig,
  Preference,
  Payment as MpPayment,
} from 'mercadopago';
import { Repository } from 'typeorm';
import { Payment } from './entities/entity.payment';
import { User } from 'src/users/entities/user.entity';
import { Plan } from './entities/entity.plan';
import { Subscription } from './entities/entity.subscription';

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;
  private readonly paymentClient: MpPayment;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    const token = this.configService.get<string>('mercadoPago.accessToken')!;
    this.client = new MercadoPagoConfig({ accessToken: token });
    this.preference = new Preference(this.client);
    this.paymentClient = new MpPayment(this.client);
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

  async confirmPayment(payment_id: string, id_user: string, id_plan: number) {
    // 1. Consultar el pago en Mercado Pago
    const payment = await this.paymentClient.get({ id: payment_id });
    if (payment.status !== 'approved') {
      return { success: false, message: 'Pago no aprobado' };
    }

    // 2. Buscar usuario y plan
    const user = await this.paymentRepository.manager.findOne(User, {
      where: { id_user },
    });
    const plan = await this.paymentRepository.manager.findOne(Plan, {
      where: { id_plan },
    });
    if (!user || !plan) {
      return { success: false, message: 'Usuario o plan no encontrado' };
    }

    // 3. Crear la suscripción
    const now = new Date();
    const end = new Date(now);
    end.setFullYear(now.getFullYear() + plan.duration_plan_years);

    const subscription = this.paymentRepository.manager.create(Subscription, {
      id_admin: user,
      plan: plan,
      start_date: now,
      end_date: end,
      is_active: true,
    });
    await this.paymentRepository.manager.save(subscription);

    // 4. Guardar el pago asociado a la suscripción
    const newPayment = this.paymentRepository.create({
      id_subscription: subscription,
      mp_payment_id: String(payment_id),
      amount: payment.transaction_amount,
      currency: payment.currency_id,
      status: payment.status,
      payment_date: payment.date_created,
    });
    await this.paymentRepository.save(newPayment);

    return { success: true, message: 'Pago confirmado y suscripción creada' };
  }
}
