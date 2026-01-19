import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotification } from './entities/email-notification.entity';
import { SmsNotification } from './entities/sms-notification.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([EmailNotification]),
    TypeOrmModule.forFeature([SmsNotification])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
