// users.controller.ts
import { Controller, Put, Body } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  async updateProfile(
    @Body()
    updateData: {
      userId: string;
      name?: string;
      email?: string;
      phone?: string;
      whatsapp?: string;
    },
  ) {
    const { userId, ...profileData } = updateData;
    const updatedUser = await this.usersService.updateUser(userId, profileData);
    return { user: updatedUser };
  }
}
