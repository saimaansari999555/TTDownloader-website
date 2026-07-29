import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(emailOrUsername);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, username: user.username, role: user.roleId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
