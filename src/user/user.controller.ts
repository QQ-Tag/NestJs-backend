import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
}