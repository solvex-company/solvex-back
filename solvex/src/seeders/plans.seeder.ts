import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from 'src/payments/entities/entity.plan';
import { Repository } from 'typeorm';

@Injectable()
export class PlansSeeder {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async seed() {
    const planExist = await this.planRepository.count();
    if (planExist > 0) {
      console.log(
        '🟡 Los planes de suscripción ya existen. No se insertaron duplicados.',
      );
      return;
    }

    const plans = [
      {
        plan_name: 'Plan 1 año',
        total_price: 100,
        duration_plan_years: 1,
        percentage_discount: 0,
        annual_price: 100,
      },
      {
        plan_name: 'Plan 3 año',
        total_price: 225,
        duration_plan_years: 3,
        percentage_discount: 25,
        annual_price: 75,
      },
      {
        plan_name: 'Plan 5 año',
        total_price: 375,
        duration_plan_years: 5,
        percentage_discount: 25,
        annual_price: 125,
      },
    ];

    await this.planRepository.save(plans);
    console.log('🟢 Planes de suscripción creados exitosamente.');
  }
}
