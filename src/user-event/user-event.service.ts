import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Events } from "src/events/events.entity";
import { EventsService } from "src/events/events.service";
import { User, UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { userEvent } from "./user-event.entity";
import * as moment from 'moment-timezone';

@Injectable()
export class UserEventService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
        @InjectRepository(userEvent)
        private userEventRepository: Repository<userEvent>,
    ) { }

    private async validateUserAndEvent(userId: number, eventId: number) {
        const user = await this.usersService.findOne(userId);
        const event = await this.eventsService.findOne(eventId);
        if (!user || !event) {
            throw new HttpException('User or Event not found', HttpStatus.NOT_FOUND);
        }
        return { user, event };
    }

    private async checkUserExistsInEvent(user: User, eventId: number) {
        const usersInEvent = await this.getUsersByEventId(eventId);
        return usersInEvent.some((existingUser) => existingUser.id === user.id);
    }

    private async findUserEvent(user: User, event: Events) {
        const userEvent = await this.userEventRepository.findOne({ where: { userId: user.id, eventId: event.id } });
        if (!userEvent) {
            throw new HttpException('UserEvent not found', HttpStatus.NOT_FOUND);
        }
        return userEvent;
    }

    async addUserToEvent(userId: number, eventId: number): Promise<userEvent> {
        const { user, event } = await this.validateUserAndEvent(userId, eventId);

        if (await this.checkUserExistsInEvent(user, eventId)) {
            throw new HttpException('User already in event', HttpStatus.NOT_ACCEPTABLE);
        }

        const userevent = new userEvent();
        userevent.user = user;
        userevent.event = event;
        return this.userEventRepository.save(userevent);
    }

    async deleteUserFromEvent(userId: number, eventId: number): Promise<userEvent> {
        const { user, event } = await this.validateUserAndEvent(userId, eventId);

        if (!(await this.checkUserExistsInEvent(user, eventId))) {
            throw new HttpException('User not in event', HttpStatus.NOT_ACCEPTABLE);
        }

        const userEvent = await this.findUserEvent(user, event);
        await this.userEventRepository.remove(userEvent);
        return userEvent;
    }

    async getUsersByEventId(eventId: number): Promise<User[]> {
        const userEvents = await this.userEventRepository
            .createQueryBuilder("userEvent")
            .leftJoinAndSelect("userEvent.user", "user")
            .where("userEvent.eventId = :eventId", { eventId })
            .getMany();
        return userEvents.map(userEvent => userEvent.user);
    }

    async getUserEventsByEventId(eventId: number): Promise<userEvent[]> {
        const userEvents = await this.userEventRepository
            .createQueryBuilder("userEvent")
            .leftJoinAndSelect("userEvent.user", "user")
            .where("userEvent.eventId = :eventId", { eventId })
            .getMany();

        return userEvents;
    }

    async confirmUser(userId: number, eventId: number): Promise<userEvent> {
        const { user, event } = await this.validateUserAndEvent(userId, eventId);
        const userEvent = await this.findUserEvent(user, event);
        const currentDate = new Date();
        const eventDate = new Date(event.date);
        const confirmationCutoff = new Date(eventDate.getTime() - (4 * 60 * 60 * 1000)); // 4 hours before event

        if (currentDate < confirmationCutoff) {
            throw new HttpException('Cannot confirm event. Confirmations are only allowed 4 hours before the event start time', HttpStatus.NOT_ACCEPTABLE);
        }

        if (userEvent.confirmed == true) {
            throw new HttpException('Presence already confirmed', HttpStatus.NOT_ACCEPTABLE);
        }

        userEvent.confirmed = true;
        await this.userEventRepository.save(userEvent);
        return userEvent;
    }
}
