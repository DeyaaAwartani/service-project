import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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

  private extractFailureReason(err: any): string {
    const status = err?.response?.status;
    // if there is a response HTTP
    if (status) {
      const respMsg = err?.response?.data?.message;
      const msg = Array.isArray(respMsg) ? respMsg.join(', ') : respMsg;
      return `HTTP_${status}: ${msg ?? err?.response?.statusText ?? 'Request failed'}`;
    }

    // Twilio
    if (err?.status && typeof err.status === 'number') {
      const msg = err?.message ?? 'Twilio error';
      return `TWILIO_HTTP_${err.status}: ${msg}`;
    }

    //if no response (timeout / ECONNREFUSED / network)
    const code = err?.code ? String(err.code) : 'UNKNOWN_ERROR';
    const msg = err?.message ? String(err.message) : String(err);
    return `${code}: ${msg}`;
  }

  // classify 400 or 500
  private classifyHttpStatus(err: any): number {
    // Validation/BadRequest
    if (err instanceof BadRequestException) return HttpStatus.BAD_REQUEST;

    // Twilio: status between 400 - 499
    const twilioStatus = err?.status;
    if (
      typeof twilioStatus === 'number' &&
      twilioStatus >= 400 &&
      twilioStatus < 500
    ) {
      return HttpStatus.BAD_REQUEST;
    }

    // Template not found: 500
    const msg = String(err?.message ?? '');
    if (msg.includes('Template not found'))
      return HttpStatus.INTERNAL_SERVER_ERROR;

    // (SMTP, DB, ...): 500
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  async createEmail(dto: CreateEmailNotificationDto) {
    const fromEmail =
      this.configService.get<string>('notifications.fromEmail') ||
      'deyaawork54@gmail.com';

    // if error in template
    let html: string;
    try {
      html = this.templateService.render(dto.template, dto.templateData);
    } catch (err) {
      const failureReason = this.extractFailureReason(err);
      const statusCode = this.classifyHttpStatus(err);

      throw new HttpException(
        {
          message: failureReason,
        },
        statusCode,
      );
    }

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

    // In every attempt to send
    email.attempts = (email.attempts ?? 0) + 1;
    await this.emailRepo.save(email);

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

      await this.emailRepo.save(email);

      // Response for another project
      return {
        success: true,
        deliveryStatus: email.status,
        //notificationId: email.id,
      };
    } catch (err) {
      const failureReason = this.extractFailureReason(err);
      const statusCode = this.classifyHttpStatus(err);

      email.status = DeliveryStatus.FAILED;
      email.lastError = failureReason;
      await this.emailRepo.save(email);

      throw new HttpException(
        {
          message: failureReason,
          //notificationId: email.id,
        },
        statusCode,
      );
    }
  }

  async createSms(dto: CreateSmsNotificationDto) {
    const fromPhoneNumber = this.configService.get<string>('twilio.fromNumber');

    if (!fromPhoneNumber) {
      throw new HttpException(
        {
          message: 'SERVER_MISCONFIG: twilio.fromNumber is missing',
          failureReason: 'SERVER_MISCONFIG: twilio.fromNumber is missing',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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

    sms.attempts = (sms.attempts ?? 0) + 1;
    await this.smsRepo.save(sms);

    try {
      await this.smsService.sendSms({
        from: fromPhoneNumber,
        to: sms.toPhoneNumber,
        body: sms.message,
      });

      sms.status = DeliveryStatus.SENT;
      sms.sentAt = new Date();
      sms.lastError = null;

      await this.smsRepo.save(sms);

      return {
        success: true,
        deliveryStatus: sms.status,
        //notificationId: sms.id,
      };
    } catch (err) {
      const failureReason = this.extractFailureReason(err);
      const statusCode = this.classifyHttpStatus(err);

      sms.status = DeliveryStatus.FAILED;
      sms.lastError = failureReason;
      await this.smsRepo.save(sms);

      throw new HttpException(
        {
          message: failureReason,
          //notificationId: sms.id,
        },
        statusCode,
      );
    }
  }
}
