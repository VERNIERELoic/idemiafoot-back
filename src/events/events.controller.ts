import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
    UseGuards,
    Req,
    Put,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventsDto } from './dto/create-event.dto';
import { Events } from './events.entity';
import { User } from 'src/users/user.entity';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post('createEvent')
    @UseGuards(JwtAuthGuard)
    async createEvent(@Body() createEventDto: CreateEventsDto) {
        return this.eventsService.createEvent(createEventDto.date, createEventDto.sport);
    }

    @Delete('remove/:id')
    @UseGuards(JwtAuthGuard)
    async deleteEvent(@Param('id') id: number) {
        return this.eventsService.deleteEvent(id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(): Promise<Events[]> {
        return this.eventsService.findAll();
    }

    @Get('getEvent/:id')
    @UseGuards(JwtAuthGuard)
    async getEventById(@Param('id') id: number): Promise<Events> {
        return this.eventsService.findOne(id);
    }

    @Post('addUserToEvent')
    @UseGuards(JwtAuthGuard)
    async addUserToEvent(@Body('userId') userId: number, @Body('eventId') eventId: number) {
        return this.eventsService.addUserToEvent(userId, eventId);
    }

    @Get('getUsersByEventId/:id')
    @UseGuards(JwtAuthGuard)
    async getUsersByEventId(@Param('eventId') eventId: number): Promise<User[]> {
        return this.eventsService.getUsersByEventId(eventId);
      }
}
