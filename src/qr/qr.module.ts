// src/qr/qr.module.ts
import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Batch } from './models/batch.model';
import { QrCode } from './models/qr-code.model';
import { User } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Batch, QrCode, User])],
  controllers: [QrController],
  providers: [QrService],
})
export class QrModule {}