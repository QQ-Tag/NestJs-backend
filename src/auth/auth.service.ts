import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { Admin } from '../admin/admin.model';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Admin) private adminModel: typeof Admin,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Validating user with email:', email);
    const user = await this.userModel.findOne({
      where: { email },
    });
    console.log('User found:', user ? user.toJSON() : 'No user found');

    if (user && user.password && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async createUser(userData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    whatsapp?: string;
  }): Promise<User> {
    return this.userModel.create(userData);
  }

  async validateAdmin(username: string, password: string): Promise<any> {
    const admin = await this.adminModel.findOne({
      where: { username },
    });
    console.log('Validating admin with username:', username);

    if (admin && admin.password === password) {
      const { password, ...result } = admin.toJSON();
      return result;
    }
    return null;
  }

  async verifyGoogleToken(token: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Google token payload is missing');
      }
      return {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      };
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }
}