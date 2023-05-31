import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
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
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async addUserToEvent(userId: number, eventId: number): Promise<userEvent> {
        const user = await this.usersService.findOne(userId)
        const event = await this.eventsService.findOne(eventId)

        if (!user || !event) {
            throw new HttpException('User or Event not found', HttpStatus.NOT_FOUND);
        }

        const usersInEvent = await this.getUsersByEventId(eventId);
        const userExists = usersInEvent.find((existingUser) => existingUser.id === user.id);

        if (userExists) {
            throw new HttpException('User already in event', HttpStatus.NOT_ACCEPTABLE);
        }

        const userevent = new userEvent();
        userevent.user = user;
        userevent.event = event;

        return this.userEventRepository.save(userevent);
    }


    async deleteUserFromEvent(userId: number, eventId: number): Promise<userEvent> {
        const user = await this.usersService.findOne(userId);
        const event = await this.eventsService.findOne(eventId);
    
        if (!user || !event) {
            throw new HttpException('User or Event not found', HttpStatus.NOT_FOUND);
        }
    
        const usersInEvent = await this.getUsersByEventId(eventId);
        const userExists = usersInEvent.find((existingUser) => existingUser.id === user.id);
    
        if (!userExists) {
            throw new HttpException('User not in event', HttpStatus.NOT_ACCEPTABLE);
        }
    
        const userEvent = await this.userEventRepository.findOne({ where: { user, event } });
    
        if (!userEvent) {
            throw new HttpException('UserEvent not found', HttpStatus.NOT_FOUND);
        }
    
        await this.userEventRepository.remove(userEvent);
    
        return userEvent;
    }
    
    




    async getUsersByEventId(eventId: number): Promise<User[]> {
        const userEvents = await this.userEventRepository
            .createQueryBuilder("userEvent")
            .leftJoinAndSelect("userEvent.user", "user")
            .where("userEvent.eventId = :eventId", { eventId })
            .getMany();

        const users = userEvents.map(userEvent => userEvent.user);

        return users;
    }
}
