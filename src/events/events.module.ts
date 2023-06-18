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
import { userEvent } from 'src/user-event/user-event.entity';
import { UserEventService } from 'src/user-event/user-event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Events, User, Teams, userEvent]),
  ],
  providers: [EventsService, MailingService, UsersService, TeamsService, UserEventService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule { }
