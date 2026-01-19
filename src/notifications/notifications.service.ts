import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailNotification } from './entities/email-notification.entity';
import { Repository } from 'typeorm';
import { SmsNotification } from './entities/sms-notification.entity';
import { ConfigService } from '@nestjs/config';
import { CreateEmailNotificationDto } from './dto/create-email-notification.dto';
import { CreateSmsNotificationDto } from './dto/create-sms-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(EmailNotification) private readonly emailRepo: Repository<EmailNotification>,
    @InjectRepository(SmsNotification) private readonly smsRepo: Repository<SmsNotification>,
    private readonly configService: ConfigService,
  ) {}

  async createEmail(dto: CreateEmailNotificationDto) {
    const fromEmail = this.configService.get<string>('notifications.fromEmail');

    const email = this.emailRepo.create({
      fromEmail,
      toEmail: dto.toEmail,
      ccList: dto.ccList,
      bccList: dto.bccList,
      title: dto.title,
      message: dto.message,
    });

    return await this.emailRepo.save(email);
  }

  async createSms(dto: CreateSmsNotificationDto) {
    const fromPhoneNumber = this.configService.get<string>('notifications.fromPhoneNumber');

    const sms = this.smsRepo.create({
      fromPhoneNumber,
      toPhoneNumber: dto.toPhoneNumber,
      message: dto.message,
    });

    return await this.smsRepo.save(sms);
  }
}
