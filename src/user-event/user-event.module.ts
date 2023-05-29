import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Events } from 'src/events/events.entity';
import { userEvent } from './user-event.entity';
import { UserEventService } from './user-event.service';
import { UserEventController } from './user-event.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([userEvent, User, Events]),
  ],
  providers: [UserEventService],
  exports: [UserEventService],
  controllers: [UserEventController],
})
export class UserEventModule {}




