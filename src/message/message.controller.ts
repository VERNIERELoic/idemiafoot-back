import {
    Controller,
    Get,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('message')
export class MessageController {

    constructor(private messageService: MessageService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,){}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(): Promise<Message[]> {
        return this.messageService.findAll();
      }
}
