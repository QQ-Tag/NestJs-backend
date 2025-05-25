import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    QrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
