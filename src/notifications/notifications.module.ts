import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotification } from './entities/email-notification.entity';
import { SmsNotification } from './entities/sms-notification.entity';
import { TemplateService } from './templates/template.service';
import { MailService } from 'src/notifications/mail/mail.service';
import { SmsService } from './sms/sms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailNotification]),
    TypeOrmModule.forFeature([SmsNotification]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, TemplateService, MailService,SmsService],
})
export class NotificationsModule {}
