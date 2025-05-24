import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, type: 'user' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        whatsapp: user.whatsapp,
      },
    };
  }

  @Post('signup')
  async signup(@Body() body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    whatsapp?: string;
  }) {
    const existingUser = await this.authService.findUserByEmail(body.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.authService.createUser({
      ...body,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email, type: 'user' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        whatsapp: user.whatsapp,
      },
    };
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() body: { username: string; password: string }) {
    const admin = await this.authService.validateAdmin(body.username, body.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload = { sub: admin.id, username: admin.username, type: 'admin' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  }

  @Post('google')
  async googleAuth(@Body() body: { token: string }) {
    const googleUser = await this.authService.verifyGoogleToken(body.token);
    
    let user = await this.authService.findUserByEmail(googleUser.email);
    if (!user) {
      user = await this.authService.createUser({
        email: googleUser.email,
        name: googleUser.name,
        password: undefined, // Google users don't have passwords
      });
    }

    const payload = { sub: user.id, email: user.email, type: 'user' };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        whatsapp: user.whatsapp,
      },
    };
  }
}