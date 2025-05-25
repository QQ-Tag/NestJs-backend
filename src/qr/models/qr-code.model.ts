import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Batch } from './batch.model';
import { User } from '../../user/user.model';

export enum QrStatus {
  UNCLAIMED = 'Unclaimed',
  CLAIMED = 'Claimed',
  DELETED = 'Deleted',
}

@Table({
  tableName: 'qr_codes',
  timestamps: true,
})
export class QrCode extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare uniqueId: string;

  @ForeignKey(() => Batch)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare batchId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(QrStatus)),
    defaultValue: QrStatus.UNCLAIMED,
  })
  declare status: QrStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare url: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Batch)
  declare batch: Batch;
}
