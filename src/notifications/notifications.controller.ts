import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateEmailNotificationDto } from './dto/create-email-notification.dto';
import { CreateSmsNotificationDto } from './dto/create-sms-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('email')
  createEmail(@Body() dto: CreateEmailNotificationDto) {
    return this.notificationsService.createEmail(dto);
  }

  @Post('sms')
  createSms(@Body() dto: CreateSmsNotificationDto) {
    return this.notificationsService.createSms(dto);
  }
}
