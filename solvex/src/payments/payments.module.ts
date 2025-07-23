import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { Plan } from './entities/entity.plan';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Plan])],
=======
import { PaymentsService } from './payments.service';

@Module({
  imports: [],
>>>>>>> d08333e45e563bad758d1479c0c71c6b2a87042c
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
