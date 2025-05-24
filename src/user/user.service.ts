import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    whatsapp?: string;
  }): Promise<User> {
    const existingUser = await this.userModel.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('User already exists with this email.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userModel.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      whatsapp: userData.whatsapp,
    } as any); // Temporary type cast to bypass strict TypeScript checking

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }
}