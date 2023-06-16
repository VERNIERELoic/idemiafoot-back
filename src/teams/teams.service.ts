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


    async addUserToTeam(teamId: number, userId: number): Promise<Teams> {
        const team = await this.teamsRepository.findOne({ where: { id: teamId }, relations: ["users"] });
        if (!team) {
            throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
        }

        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        team.users.push(user);

        return this.teamsRepository.save(team);
    }



}
