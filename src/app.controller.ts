import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { get } from 'http';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { User, UsersService } from './users/users.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private  authService: AuthService, private usersService: UsersService, private appService: AppService) { }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
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