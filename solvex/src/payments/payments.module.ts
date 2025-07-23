import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';
import { Plan } from './entities/entity.plan';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Plan])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
