import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Teams } from 'src/teams/teams.entity';
import { TeamsService } from './teams.service';
import { User } from 'src/users/user.entity';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createTeam(@Body('eventId') eventId: number): Promise<Teams> {
        return this.teamsService.createTeam(eventId);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard)
    async deleteTeam(@Body('teamId') teamId: number): Promise<void> {
        return this.teamsService.deleteTeam(teamId);
    }

    @Get('getTeamsByEvent/:id')
    async getTeamByEvent(@Param('id') eventId: number) {
        return await this.teamsService.getTeamsByEvent(eventId);
    }

    @Post('addUserToTeam')
    @UseGuards(JwtAuthGuard)
    async addUsersToTeam(@Body('teamId') teamId: number, @Body('userIds') userIds: number[]): Promise<Teams> {
        return this.teamsService.addUsersToTeam(teamId, userIds);
    }

    @Post('getUsersByTeam')
    async getUsersByTeam(@Body('teamId') teamId: number): Promise<User[]> {
        return this.teamsService.getUsersByTeam(teamId);
    }

    @Get('getFreePlayers/:id')
    async getFreePlayers(@Param('eventId') eventId: number): Promise<User[]> {
      return this.teamsService.getFreePlayers(eventId);
    }
}
