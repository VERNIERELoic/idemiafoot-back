import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) { }

    async createMessage(username: string, text: string): Promise<Message> {
        const newMessage = this.messageRepository.create({
            id: uuidv4(),
            username,
            text,
        });
        console.log(newMessage);
        await this.messageRepository.save(newMessage);
        return newMessage;
    }

    async getMessage(uuid: string): Promise<Message> {
        return this.messageRepository.findOne({ where: { id: uuid } });
    }

    async findAll(): Promise<Message[]> {
        return this.messageRepository.find();
    }
}
