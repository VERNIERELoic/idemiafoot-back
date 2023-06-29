import {
    Controller,
    Get,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('message')
export class MessageController {

    constructor(private messageService: MessageService){}
    
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(): Promise<Message[]> {
        return this.messageService.findAll();
    }
}
