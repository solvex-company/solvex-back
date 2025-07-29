import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { MailTemplatesService } from './templates/mailTemplate.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MailTemplatesService, MailService],
  exports: [MailService],
})
export class MailModule {}
