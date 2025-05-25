// src/qr/qr.controller.ts
import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QrService } from './qr.service';
import { Batch } from './models/batch.model';
import { QrCode } from './models/qr-code.model';
import { User } from '../user/user.model';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post('batches/generate')
  async generateQrBatch(
    @Body() body: { batchName: string; quantity: number },
  ): Promise<Batch> {
    return this.qrService.generateQrBatch(body.batchName, body.quantity);
  }

  @Get('batches')
  async getAllBatches(): Promise<Batch[]> {
    return this.qrService.getAllBatches();
  }

  @Get('batches/:batchId')
  async getBatchById(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<Batch | null> {
    return this.qrService.getBatchById(batchId);
  }

  @Get('batches/:batchId/qr-codes')
  async getQrCodesByBatchId(
    @Param('batchId', ParseIntPipe) batchId: number,
  ): Promise<QrCode[]> {
    return this.qrService.getQrCodesByBatchId(batchId);
  }

  @Get('qr-codes/:id')
  async getQrCodeById(@Param('id', ParseIntPipe) id: number): Promise<QrCode | null> {
    return this.qrService.getQrCodeById(id);
  }

  @Get('qr-codes/unique/:uniqueId')
  async getQrCodeByUniqueId(@Param('uniqueId') uniqueId: string): Promise<QrCode | null> {
    return this.qrService.getQrCodeByUniqueId(uniqueId);
  }

  @Get('users/:userId')
  async getOwnerByUserId(@Param('userId') userId: string): Promise<User | null> {
    return this.qrService.getOwnerByUserId(userId);
  }

  @Post('qr-codes/claim')
  async claimQrCode(@Body() body: { id: number; userId: string }): Promise<boolean> {
    return this.qrService.claimQrCode(body.id, body.userId);
  }

  @Get('users/:userId/qr-codes')
  async getUserLinkedQrCodes(@Param('userId') userId: string): Promise<QrCode[]> {
    return this.qrService.getUserLinkedQrCodes(userId);
  }

  @Post('qr-codes/unlink')
  async unlinkQrCode(@Body() body: { id: number; userId: string }): Promise<boolean> {
    return this.qrService.unlinkQrCode(body.id, body.userId);
  }

  @Post('qr-codes/delete')
  async deleteQrCode(@Body() body: { id: number; userId: string }): Promise<boolean> {
    return this.qrService.deleteQrCode(body.id, body.userId);
  }
}