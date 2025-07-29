import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MyGateway],
})
export class GatewayModule {}
