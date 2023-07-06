import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsService } from 'src/events/events.service';
import { User, UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Teams } from './teams.entity';
import { UserEventService } from 'src/user-event/user-event.service';

@Injectable()
export class TeamsService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
        private readonly userEventService: UserEventService,
        @InjectRepository(Teams)
        private teamsRepository: Repository<Teams>,
    ) { }

    private async validateTeamExists(id: number) {
        const team = await this.teamsRepository.findOne({ where: { id }, relations: ["users", "event"] });
        if (!team) throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
        return team;
    }

    private async validateEventExists(id: number) {
        const event = await this.eventsService.findOne(id);
        if (!event) throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        return event;
    }

    async createTeam(eventId: number): Promise<Teams> {
        const event = await this.validateEventExists(eventId);

        const team = new Teams();
        team.event = event;
        return this.teamsRepository.save(team);
    }

    async deleteTeam(teamId: number): Promise<void> {
        const team = await this.validateTeamExists(teamId);
        await this.teamsRepository.remove(team);
    }

    async getTeamsByEvent(eventId: number): Promise<Teams[]> {
        const event = await this.validateEventExists(eventId);
        return this.teamsRepository.find({ where: { event: { id: eventId } } });
    }

    async getFreePlayers(eventId: number): Promise<User[]> {
        const event = await this.validateEventExists(eventId);

        const eventUsers = await this.userEventService.getUsersByEventId(eventId);
        const teams = await this.teamsRepository.find({ where: { event: { id: eventId } }, relations: ["users"] });
        const teamUserIds = teams.flatMap((team) => team.users.map((user) => user.id));
        return eventUsers.filter((user) => !teamUserIds.includes(user.id));
    }

    async isTeamExist(teamId: number): Promise<Teams> {
        return this.validateTeamExists(teamId);
    }

    async addUsersToTeam(teamId: number, userIds: number[]): Promise<Teams> {
        if (!Array.isArray(userIds) || !userIds.every(Number.isInteger)) {
            throw new HttpException('Invalid userIds', HttpStatus.BAD_REQUEST);
        }
        
        const team = await this.validateTeamExists(teamId);

        const usersToAdd = [];
        for (const userId of userIds) {
            const user = await this.usersService.findOne(userId);
            if (!user) throw new HttpException(`User with id ${userId} not found`, HttpStatus.NOT_FOUND);

            const userTeams = await this.teamsRepository.createQueryBuilder("teams")
                .innerJoinAndSelect("teams.event", "event")
                .innerJoin("teams.users", "user", "user.id = :userId", { userId })
                .getMany();

            if (userTeams.some(userTeam => userTeam.event.id === team.event.id && userTeam.id !== team.id)) {
                throw new HttpException(`User with id ${userId} is already in another team for the same event`, HttpStatus.CONFLICT);
            }
            usersToAdd.push(user);
        }
        team.users = team.users.concat(usersToAdd);
        return this.teamsRepository.save(team);
    }

    async getUsersByTeam(teamId: number): Promise<User[]> {
        const team = await this.validateTeamExists(teamId);
        return team.users;
    }
}
