import { Controller, Post, UseGuards, Request, Response, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any, @Response() res: any) {
    const { accessToken } = await this.authService.login(req.user);
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.send({ message: 'Logged in successfully' });
  }

  @Post('logout')
  async logout(@Response() res: any) {
    res.clearCookie('accessToken');
    return res.send({ message: 'Logged out successfully' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
