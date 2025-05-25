// src/qr/qr.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Batch } from './models/batch.model';
import { QrCode, QrStatus } from './models/qr-code.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Op } from 'sequelize';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(Batch) private batchModel: typeof Batch,
    @InjectModel(QrCode) private qrCodeModel: typeof QrCode,
    @InjectModel(User) private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  // Utility to pad numbers (e.g., 1 -> "000001")
  private padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }

  async generateQrBatch(batchName: string, quantity: number): Promise<Batch> {
    if (!batchName || quantity <= 0) {
      throw new BadRequestException(
        'Batch name and positive quantity are required',
      );
    }

    // Get the last QR code uniqueId to continue the sequence
    const lastQrCode = await this.qrCodeModel.findOne({
      order: [['uniqueId', 'DESC']],
    });

    let lastNumber = 0;
    if (lastQrCode) {
      lastNumber = parseInt(lastQrCode.uniqueId.replace('QR', ''), 10);
    }

    // Calculate start and end IDs
    const startNumber = lastNumber + 1;
    const endNumber = lastNumber + quantity;
    const startId = `QR${this.padNumber(startNumber, 6)}`;
    const endId = `QR${this.padNumber(endNumber, 6)}`;

    // Use transaction for atomicity
    return this.sequelize.transaction(async (transaction) => {
      // Create the batch
      const batch = await this.batchModel.create(
        {
          batchName,
          startId,
          endId,
          quantity,
        },
        { transaction },
      );

      // Generate QR codes
      const qrCodes: Partial<QrCode>[] = [];
      const baseUrl = 'https://your-domain.com/qr/'; // Replace with your domain
      for (let i = startNumber; i <= endNumber; i++) {
        const uniqueId = `QR${this.padNumber(i, 6)}`;
        qrCodes.push({
          uniqueId,
          batchId: batch.id,
          userId: undefined,
          status: QrStatus.UNCLAIMED,
          url: `${baseUrl}${uniqueId}`,
        });
      }

      // Bulk create QR codes
      await this.qrCodeModel.bulkCreate(qrCodes, { transaction });

      return batch;
    });
  }

  async getAllBatches(): Promise<Batch[]> {
    return this.batchModel.findAll();
  }

  async getBatchById(batchId: number): Promise<Batch | null> {
    return this.batchModel.findByPk(batchId);
  }

  async getQrCodesByBatchId(batchId: number): Promise<QrCode[]> {
    return this.qrCodeModel.findAll({
      where: { batchId, status: { [Op.ne]: QrStatus.DELETED } },
    });
  }

  async getAllQrCodes(): Promise<QrCode[]> {
    return this.qrCodeModel.findAll({
      where: { status: { [Op.ne]: QrStatus.DELETED } },
    });
  }

  async getQrCodeById(id: number): Promise<QrCode | null> {
    return this.qrCodeModel.findOne({
      where: { id, status: { [Op.ne]: QrStatus.DELETED } },
    });
  }

  async getQrCodeByUniqueId(uniqueId: string): Promise<QrCode | null> {
    return this.qrCodeModel.findOne({
      where: { uniqueId, status: { [Op.ne]: QrStatus.DELETED } },
    });
  }

  async getOwnerByUserId(userId: string): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }

  async claimQrCode(id: number, userId: string): Promise<boolean> {
    const qrCode = await this.qrCodeModel.findOne({
      where: { id, status: QrStatus.UNCLAIMED },
    });
    if (!qrCode) {
      return false;
    }

    await qrCode.update({ userId, status: QrStatus.CLAIMED });
    return true;
  }

  async getUserLinkedQrCodes(userId: string): Promise<QrCode[]> {
    return this.qrCodeModel.findAll({
      where: { userId, status: { [Op.ne]: QrStatus.DELETED } },
    });
  }

  async unlinkQrCode(id: number, userId: string): Promise<boolean> {
    const qrCode = await this.qrCodeModel.findOne({
      where: { id, userId },
    });
    if (!qrCode) {
      return false;
    }

    await qrCode.update({ userId: null, status: QrStatus.UNCLAIMED });
    return true;
  }

  async deleteQrCode(id: number, userId: string): Promise<boolean> {
    const qrCode = await this.qrCodeModel.findOne({
      where: { id, userId },
    });
    if (!qrCode) {
      return false;
    }

    await qrCode.update({ status: QrStatus.DELETED });
    return true;
  }
}
