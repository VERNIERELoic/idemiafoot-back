import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/users/user.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) { }

    async createMessage(user: User, text: string): Promise<Message> {
        const newMessage = this.messageRepository.create({
            id: uuidv4(),
            user,
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
        return this.messageRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.user', 'user')
          .getMany();
      }      
}
