import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Teams } from 'src/teams/teams.entity';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { userEvent } from 'src/user-event/user-event.entity';
import { UserEventModule } from 'src/user-event/user-event.module';
import { UserEventService } from 'src/user-event/user-event.service';
import { MailingService } from 'src/mailing/mailing.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Events, User, Teams, userEvent]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsModule),
    forwardRef(() => UserEventModule),
  ],
  providers: [TeamsService, UserEventService, MailingService],
  exports: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule { }
