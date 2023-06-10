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


@Module({
  imports: [
    TypeOrmModule.forFeature([userEvent, Events, User, Teams]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsModule),
  ],
  providers: [UserEventService],
  exports: [UserEventService],
  controllers: [UserEventController],
})
export class UserEventModule {}
