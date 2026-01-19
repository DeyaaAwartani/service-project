import { IsString, MaxLength } from 'class-validator';

export class CreateSmsNotificationDto {
  
  @IsString()
  @MaxLength(30)
  toPhoneNumber: string;

  @IsString()
  message: string;
}
