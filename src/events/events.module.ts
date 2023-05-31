import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Events } from './events.entity';
import { EventsService } from './events.service';
import { User } from 'src/users/user.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events, User]),
  ],
  providers: [EventsService, MailingService, UsersService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule { }
