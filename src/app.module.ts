import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { EventsModule } from './events/events.module';
import { UserEventService } from './user-event/user-event.service';
import { UserEventController } from './user-event/user-event.controller';
import { UserEventModule } from './user-event/user-event.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    JwtModule,
    EventsModule,
    UserEventModule,
  ],
  controllers: [AppController, UserEventController],
  providers: [AuthService, AppService, UserEventService],

})
export class AppModule {}