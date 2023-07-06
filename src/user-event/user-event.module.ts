import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEvent } from './user-event.entity';
import { UserEventController } from './user-event.controller';
import { UserEventService } from './user-event.service';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Teams } from 'src/teams/teams.entity';
import { TeamsModule } from 'src/teams/teams.module';
import { MailingService } from 'src/mailing/mailing.service';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([userEvent, Events, User, Teams]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsModule),
    forwardRef(() => TeamsModule),
  ],
  providers: [UserEventService, MailingService],
  exports: [UserEventService],
  controllers: [UserEventController],
})
export class UserEventModule {}
