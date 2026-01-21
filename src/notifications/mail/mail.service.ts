import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: false, // 587 => false, 465 => true
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });
  }

  async sendEmail(params: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    return this.transporter.sendMail({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}
