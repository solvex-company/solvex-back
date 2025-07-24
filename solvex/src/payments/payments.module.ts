import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/entity.payment';
// import { Plan } from './entities/entity.plan';
// import { Subscription } from './entities/entity.subscription';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
