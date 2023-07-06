import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailingService } from 'src/mailing/mailing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly mailingService: MailingService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, isAdmin: user.isAdmin};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const resetToken = this.jwtService.sign({ userId: user.id });
  
      const resetUrl = `${this.configService.get<string>('FRONT')}/reset-password?token=${resetToken}`;
      await this.mailingService.sendPasswordResetEmail(user.email, resetUrl);
    }
  }
  
}
