import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RoleSeeder } from './seeders/role.seeder';
import { Roles } from './users/entities/Roles.entity';
import { TypeIdSeeder } from './seeders/typeId.seeder';
import { TypeId } from './users/entities/typeId.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserSeeder } from './seeders/users.seeder';
import { User } from './users/entities/user.entity';
import { Credentials } from './users/entities/Credentials.entity';
import { TicketsModule } from './tickets/tickets.module';
import { TicketStatusSeeder } from './seeders/statusTickets.seeder';
import { TicketStatus } from './tickets/entities/statusTickets.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm')!,
    }),
    TypeOrmModule.forFeature([Roles, TypeId, User, Credentials, TicketStatus]),
    UsersModule,
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60m' },
      secret: process.env.JWT_SECRET,
    }),
    TicketsModule,
  ],
  controllers: [],
  providers: [RoleSeeder, TypeIdSeeder, UserSeeder, TicketStatusSeeder],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly typeIdSeeder: TypeIdSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly ticketStatusSeeder: TicketStatusSeeder,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  async onApplicationBootstrap() {
    await this.roleSeeder.seed();
    await this.typeIdSeeder.seed();
    await this.userSeeder.seed();
    await this.ticketStatusSeeder.seed();
  }
}
