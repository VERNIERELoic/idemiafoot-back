import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageController } from './message.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
],
  providers: [MessageGateway, MessageService],
  controllers: [MessageController]
})
export class MessageModule {}