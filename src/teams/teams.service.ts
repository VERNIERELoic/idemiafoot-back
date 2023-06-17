import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventsService } from 'src/events/events.service';
import { User, UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Teams } from './teams.entity';

@Injectable()
export class TeamsService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
        @InjectRepository(Teams)
        private teamsRepository: Repository<Teams>,
    ) { }

    async createTeam(eventId: number): Promise<Teams> {
        const event = await this.eventsService.findOne(eventId);
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        const team = new Teams();
        team.event = event;
        return this.teamsRepository.save(team);
    }

    async deleteTeam(teamId: number): Promise<void> {
        const team = await this.teamsRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
        }
        await this.teamsRepository.remove(team);
    }

    async getTeamsByEvent(eventId: number): Promise<Teams[]> {
        const event = await this.eventsService.findOne(eventId);
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        return this.teamsRepository.find({ where: { event: { id: eventId } } });
    }

    async getFreePlayers(eventId: number): Promise<User[]> {
        const event = await this.eventsService.findOne(eventId);
        if (!event) {
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
        }

        const teams = await this.teamsRepository.find({ where: { event: { id: eventId } }, relations: ["users"] });

        const teamUserIds = teams.flatMap((team) => team.users.map((user) => user.id));

        const allUsers = await this.usersService.findAll();

        const freePlayers = allUsers.filter((user) => !teamUserIds.includes(user.id));

        return freePlayers;
    }

    async addUsersToTeam(teamId: number, userIds: number[]): Promise<Teams> {
        const team = await this.teamsRepository.findOne({ where: { id: teamId }, relations: ["users"] });
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
        }

        const usersToAdd = [];
        for (const userId of userIds) {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new HttpException(`User with id ${userId} not found`, HttpStatus.NOT_FOUND);
            }
            const otherTeam = await this.teamsRepository.findOne({ where: { users: { id: user.id } }, relations: ["users"] });
            if (otherTeam && otherTeam.id !== team.id) {
                throw new HttpException(`User with id ${userId} is already in team ${otherTeam.id}`, HttpStatus.CONFLICT);
            }
            usersToAdd.push(user);
        }

        team.users = usersToAdd;

        return this.teamsRepository.save(team);
    }

    async getUsersByTeam(teamId: number): Promise<User[]> {
        const team = await this.teamsRepository.findOne({ where: { id: teamId }, relations: ["users"] });

        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
        }

        return team.users;
    }




}
