import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { userEvent } from './user-event.entity';
import { EventsService } from 'src/events/events.service';
import { UsersService } from 'src/users/users.service';
import { Events } from 'src/events/events.entity';

@Injectable()
export class UserEventService {
    userService: any;
    eventService: any;
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
        @InjectRepository(userEvent)
        private userEventRepository: Repository<userEvent>,
        @InjectRepository(Events)
        private EventsRepository: Repository<Events>,
    ) { }

    async addUserToEvent(userId: number, eventId: number): Promise<userEvent> {
        const user = await this.usersService.findOne(userId)
        const event = await this.eventsService.findOne(eventId)

        if (!user || !event) {
            throw new Error('User or Event not found');
        }

        const userevent = new userEvent();
        userevent.user = user;
        userevent.event = event;

        return this.userEventRepository.save(userevent);
    }

    async getUsersByEventId(eventId: number): Promise<User[]> {
        const userEvents = await this.userEventRepository.find({ where: { id: eventId } });
        const users = userEvents.map(userEvent => userEvent.user);
        return users;
    }
}
