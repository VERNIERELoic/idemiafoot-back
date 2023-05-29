import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from './events.entity';
import { User } from 'src/users/users.service';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

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


    // async addUserToEvent(userId: number, eventId: number): Promise<UserEvent> {
    //     // Rechercher l'utilisateur et l'événement dans la base de données
    //     const user = await this.usersRepository.findOne({ where: { id: userId } });
    //     const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    
    //     if (!user || !event) {
    //         throw new Error('User or Event not found');
    //     }
    
    //     // Créer une nouvelle entité UserEvent et la sauvegarder
    //     const userEvent = new UserEvent();
    //     userEvent.user = user;
    //     userEvent.event = event;
    //     return this.userEventRepository.save(userEvent);
    // }
    
    // async getUsersByEventId(eventId: number): Promise<User[]> {
    //     const event = await this.eventsRepository.findOne({ 
    //       where: { id: eventId },
    //       relations: ["user"]
    //     });
      
    //     if (!event) {
    //       throw new Error("Event not found");
    //     }
      
    //     return event.user;
    //   }
      
}