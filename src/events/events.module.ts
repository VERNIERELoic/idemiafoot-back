import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Events } from './events.entity';
import { EventsService } from './events.service';
import { User } from 'src/users/user.entity';
import { MailingService } from 'src/mailing/mailing.service';
import { UsersService } from 'src/users/users.service';
import { TeamsService } from 'src/teams/teams.service';
import { Teams } from 'src/teams/teams.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events, User, Teams]),
  ],
  providers: [EventsService, MailingService, UsersService, TeamsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule { }
