import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
} from 'sequelize-typescript';
import { QrCode } from './qr-code.model';

@Table({
  tableName: 'batches',
  timestamps: true,
})
export class Batch extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare batchName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare startId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare endId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @HasMany(() => QrCode)
  declare qrCodes: QrCode[];
}
