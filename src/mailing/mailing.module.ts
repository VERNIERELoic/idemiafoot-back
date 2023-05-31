import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [MailingService, ConfigService],
  controllers: [MailingController],
  exports: [MailingService],
})
export class MailingModule {}
