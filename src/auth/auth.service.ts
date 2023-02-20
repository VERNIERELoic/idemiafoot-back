import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import passport from 'passport';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }


  async validateUser(username: string, password: string): Promise<any> {
    const userToAuth = await this.usersService.findByUsername(username);
    if (userToAuth && bcrypt.compareSync(password, userToAuth.password)) {
      const { password: _, ...result } = userToAuth;
      return result;
    }
    return null;
  }

  async login(user: { userName: string; password: string }): Promise<any> {
    const userVerified = await this.validateUser(user.userName, user.password);
    if (!userVerified) {
      throw new Error('Authentication failed');
    } else {
      const payload = { username: userVerified.username, sub: userVerified.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
