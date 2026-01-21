import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailNotification } from './entities/email-notification.entity';
import { Repository } from 'typeorm';
import { SmsNotification } from './entities/sms-notification.entity';
import { ConfigService } from '@nestjs/config';
import { CreateEmailNotificationDto } from './dto/create-email-notification.dto';
import { CreateSmsNotificationDto } from './dto/create-sms-notification.dto';
import { DeliveryStatus } from './enums/DeliveryStatus.enum';
import { TemplateService } from './templates/template.service';
import { MailService } from 'src/notifications/mail/mail.service';
import { SmsService } from './sms/sms.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(EmailNotification)
    private readonly emailRepo: Repository<EmailNotification>,
    @InjectRepository(SmsNotification)
    private readonly smsRepo: Repository<SmsNotification>,
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {}

  async createEmail(dto: CreateEmailNotificationDto) {
    const fromEmail =
      this.configService.get<string>('notifications.fromEmail') ||
      'deyaawork54@gmail.com';

    const html = this.templateService.render(dto.template, dto.templateData);

    let email = this.emailRepo.create({
      fromEmail,
      toEmail: dto.toEmail,
      title: dto.title,
      template: dto.template,
      templateData: dto.templateData,
      renderedHtml: html,
      status: DeliveryStatus.PENDING,
      attempts: 0,
      lastError: null,
      sentAt: null,
    });

    email = await this.emailRepo.save(email);

    try {
      await this.mailService.sendEmail({
        from: fromEmail,
        to: email.toEmail,
        subject: email.title,
        html: email.renderedHtml!,
      });

      email.status = DeliveryStatus.SENT;
      email.sentAt = new Date();
      email.lastError = null;
      return this.emailRepo.save(email);
    } catch (err) {
      email.status = DeliveryStatus.FAILED;
      email.attempts = (email.attempts ?? 0) + 1;
      email.lastError = String(err?.message || err);
      return this.emailRepo.save(email);
    }
  }

  async createSms(dto: CreateSmsNotificationDto) {
    const fromPhoneNumber =
      this.configService.get<string>('twilio.fromNumber') || '(865) 459-5747';

    // store PENDING
    let sms = this.smsRepo.create({
      fromPhoneNumber,
      toPhoneNumber: dto.toPhoneNumber,
      message: dto.message,
      status: DeliveryStatus.PENDING,
      attempts: 0,
      lastError: null,
      sentAt: null,
    });

    sms = await this.smsRepo.save(sms);

    // try to send
    try {
      await this.smsService.sendSms({
        from: fromPhoneNumber,
        to: sms.toPhoneNumber,
        body: sms.message,
      });

      sms.status = DeliveryStatus.SENT;
      sms.sentAt = new Date();
      sms.lastError = null;
      return this.smsRepo.save(sms);
    } catch (err) {
      sms.status = DeliveryStatus.FAILED;
      sms.attempts = (sms.attempts ?? 0) + 1;
      sms.lastError = String(err?.message || err);
      return this.smsRepo.save(sms);
    }
  }
}
