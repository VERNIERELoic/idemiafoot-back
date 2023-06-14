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
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createTeam(@Body('eventId') eventId: number): Promise<Teams> {
        return this.teamsService.createTeam(eventId);
    }

    @Post('deleteTeam/:id')
    @UseGuards(JwtAuthGuard)
    async deleteTeam(@Param('id') id: number): Promise<void> {
        return this.teamsService.deleteTeam(id);
    }

    @Get('getTeamsByEvent/:id')
    async getTeamByEvent(@Param('id') eventId: number) {
      return await this.teamsService.getTeamsByEvent(eventId);
    }

}
