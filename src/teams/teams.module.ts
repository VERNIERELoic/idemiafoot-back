import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { Events } from 'src/events/events.entity';
import { User } from 'src/users/user.entity';
import { Teams } from 'src/teams/teams.entity';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Events, User, Teams]),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsModule),
  ],
  providers: [TeamsService],
  exports: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}
