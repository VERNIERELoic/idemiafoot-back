import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }


  // async validateUser(username: string, password: string): Promise<any> {
  //   const userToAuth = await this.usersService.findByUsername(username);
  //   if (userToAuth && bcrypt.compareSync(password, userToAuth.password)) {
  //     const { password: _, ...result } = userToAuth;
  //     return result;
  //   }
  //   return null;
  // }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    console.log("validate user : ", user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("password ok ?", isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(user: { username: string; password: string }): Promise<any> {
    const userVerified = await this.validateUser(user.username, user.password);
    console.log("login :", userVerified);
    if (!userVerified) {
      throw new Error('Authentication failed');
    } else {
      const payload = { username: userVerified.userName, sub: userVerified.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
