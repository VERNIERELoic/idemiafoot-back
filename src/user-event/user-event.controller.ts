import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEventService } from './user-event.service';
import { User } from 'src/users/user.entity';
import { UserIsSelfBodyGuard } from 'src/auth/guards/user-is-self-body-guard';

@Controller('user-event')
export class UserEventController {
    constructor(private readonly userEventService: UserEventService) { }

    @Post('addUserToEvent')
    @UseGuards(JwtAuthGuard)
    async addUserToEvent(@Body() requestBody: { userId: number, eventId: number }) {
        try {
            const { userId, eventId } = requestBody;
            const result = await this.userEventService.addUserToEvent(userId, eventId);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('deleteUserFromEvent')
    @UseGuards(JwtAuthGuard, UserIsSelfBodyGuard)
    async deleteUserFromEvent(@Body() requestBody: { userId: number, eventId: number }) {
        try {
            const { userId, eventId } = requestBody;
            const result = await this.userEventService.deleteUserFromEvent(userId, eventId);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Post('confirmUser')
    @UseGuards(JwtAuthGuard, UserIsSelfBodyGuard)
    async confirmUser(@Body() requestBody: { userId: number, eventId: number }) {
        try {
            const { userId, eventId } = requestBody;
            const result = await this.userEventService.confirmUser(userId, eventId);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get('getUsersByEventId/:id')
    @UseGuards(JwtAuthGuard)
    async getUsersByEventId(@Param('id') id: number): Promise<User[]> {
        return this.userEventService.getUsersByEventId(id);
    }
}
