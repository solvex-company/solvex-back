import { /*Inject,*/ Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Plan } from './entities/entity.plan';
// import { Repository } from 'typeorm';
// import { CreatePreferenceDto } from './dtos/createPreference.dto';

@Injectable()
export class PaymentsService {
  //   constructor(
  //     @Inject('MERCADO_PAGO') private readonly mp,
  //     @InjectRepository(Plan) private readonly planRepository: Repository<Plan>,
  //   ) {}
  //   async createCheckoutPreference(data: CreatePreferenceDto) {
  //     const plan = await this.planRepository.findOne({
  //       where: { id_plan: data.id_plan },
  //     });
  //     if (!plan) throw new Error('Plan not found');
  //     const preference = {
  //       items: [
  //         {
  //           title: plan.plan_name,
  //           quantity: 1,
  //           currency_id: 'ARS',
  //           unit_price: plan.total_price,
  //         },
  //       ],
  //       back_urls: {
  //         success: 'http://localhost:4000/payments/success',
  //         failure: 'http://localhost:4000/payments/failure',
  //         pending: 'http://localhost:4000/payments/pending',
  //       },
  //       auto_return: 'approved',
  //       external_reference: `solvex-${data.id_admin}-${plan.id_plan}`,
  //       notification_url: 'http://localhost:4000/payments/notification',
  //     };
  //     const response = await this.mp.preferences.create(preference);
  //     return response.body.init_point;
  //   }
}
