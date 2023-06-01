import { Controller, Get, UseGuards } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { User, UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mailing')
export class MailingController {
    constructor(readonly mailingService: MailingService) { }
}
