import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Request,
    UseGuards
} from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { UsersService } from './users/users.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private  authService: AuthService, private usersService: UsersService, private appService: AppService) { }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('auth/forgot')
    async forgotPassword(@Body() body: { email: string }) {
      const { email } = body;
      await this.authService.sendPasswordResetEmail(email);
      return { message: 'Recovering email sent' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Get()
    getHello(): string {
      return this.appService.getHello();
    }

}