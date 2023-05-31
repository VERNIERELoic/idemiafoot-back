import { Controller, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { User, UsersService } from 'src/users/users.service';

@Controller('mailing')
export class MailingController {

    constructor(readonly mailingService: MailingService,
        readonly usersService: UsersService) { }
    @Get('send-mail')
    public async sendMail() {
        const usersList: User[] = await this.usersService.findAll();
        const emails: string[] = usersList.map(user => user.email);
        this.mailingService.sendMail(emails);
    }
}
