import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from 'src/events/events.entity';
import { EventsService } from 'src/events/events.service';
import { Teams } from 'src/teams/teams.entity';
import { User, UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class TeamsService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
        @InjectRepository(Teams)
        private TeamsRepository: Repository<Teams>,
    ) { }

    private async validateUserAndEvent(userId: number, eventId: number) {
        const user = await this.usersService.findOne(userId);
        const event = await this.eventsService.findOne(eventId);
        if (!user || !event) {
            throw new HttpException('User or Event not found', HttpStatus.NOT_FOUND);
        }
        return { user, event };
    }

    private async checkUserExistInTeam(user: User, eventId: number) {
        const userInTeam = await this.getUsersByTeamId(eventId);
        return userInTeam.some((existingUser) => existingUser.id === user.id);
    }

    private async findUserTeams(user: User, event: Events) {
        const userEvent = await this.TeamsRepository.findOne({ where: { userId: user.id, eventId: event.id } });
        if (!userEvent) {
            throw new HttpException('UserEvent not found', HttpStatus.NOT_FOUND);
        }
        return userEvent;
    }

    async addUserToTeam(userId: number, eventId: number): Promise<Teams> {
        const { user, event } = await this.validateUserAndEvent(userId, eventId);

        if (await this.checkUserExistInTeam(user, eventId)) {
            throw new HttpException('User already in event', HttpStatus.NOT_ACCEPTABLE);
        }

        const teams = new Teams();
        teams.user = user;
        teams.event = event;
        return this.TeamsRepository.save(teams);
    }

    async deleteUserFromTeams(userId: number, eventId: number): Promise<Teams> {
        const { user, event } = await this.validateUserAndEvent(userId, eventId);

        if (!(await this.checkUserExistInTeam(user, eventId))) {
            throw new HttpException('User not in event', HttpStatus.NOT_ACCEPTABLE);
        }

        const teams = await this.findUserTeams(user, event);
        await this.TeamsRepository.remove(teams);
        return teams;
    }

    async getUsersByTeamId(eventId: number): Promise<User[]> {
        const teams = await this.TeamsRepository
            .createQueryBuilder("userEvent")
            .leftJoinAndSelect("userEvent.user", "user")
            .where("userEvent.eventId = :eventId", { eventId })
            .getMany();
        return teams.map(userEvent => userEvent.user);
    }

    async getTeamsByEventId(eventId: number): Promise<Teams[]> {
        const teams = await this.TeamsRepository
            .createQueryBuilder("Teams")
            .leftJoinAndSelect("Teams.user", "user")
            .where("Teams.eventId = :eventId", { eventId })
            .getMany();

        return teams;
    }

}
