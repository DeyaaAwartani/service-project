import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSms(params: { from: string; to: string; body: string }) {
    return this.client.messages.create({
      from: params.from,
      to: params.to,
      body: params.body,
    });
  }
}
