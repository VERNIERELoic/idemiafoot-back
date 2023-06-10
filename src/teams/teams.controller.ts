import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Teams } from 'src/teams/teams.entity';
import { User } from 'src/users/user.entity';
import { UserIsSelfBodyGuard } from 'src/auth/guards/user-is-self-body-guard';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post('addUserToTeam')
    @UseGuards(JwtAuthGuard)
    async addUserToEvent(@Body() requestBody: { userId: number, eventId: number }) {
        try {
            const { userId, eventId } = requestBody;
            const result = await this.teamsService.addUserToTeam(userId, eventId);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('deleteUserFromTeams')
    @UseGuards(JwtAuthGuard, UserIsSelfBodyGuard)
    async deleteUserFromTeams(@Body() requestBody: { userId: number, eventId: number }) {
        try {
            const { userId, eventId } = requestBody;
            const result = await this.teamsService.deleteUserFromTeams(userId, eventId);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('getTeamsByEventId/:id')
    @UseGuards(JwtAuthGuard)
    async getTeamsByEventId(@Param('id') id: number): Promise<Teams[]> {
        return this.teamsService.getTeamsByEventId(id);
    }

    @Get('getUsersByTeamId/:id')
    @UseGuards(JwtAuthGuard)
    async getUsersByTeamId(@Param('id') id: number): Promise<User[]> {
        return this.teamsService.getUsersByTeamId(id);
    }
}
