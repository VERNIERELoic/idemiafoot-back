import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';
import { User } from 'src/users/users.service';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Events)
        private readonly eventsRepository: Repository<Events>,
    ) { }


    async createEvent(date: Date, sport: string): Promise<Events> {
        const newEvent = new Events();
        newEvent.date = date;
        newEvent.sport = sport;
        return this.eventsRepository.save(newEvent);
    }

    async deleteEvent(id: number): Promise<void> {
        await this.eventsRepository.delete(id);
    }

    findOne(id: number): Promise<Events> {
        return this.eventsRepository.findOne({ where: { id: id } });
    }

    async findAll(): Promise<Events[]> {
        return this.eventsRepository.find();
    }
      
}