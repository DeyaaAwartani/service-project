import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSmsNotificationDto {
  @IsString()
  @IsNotEmpty()
  toPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
