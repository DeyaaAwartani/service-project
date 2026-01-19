import { IsArray, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmailNotificationDto {
  
  @IsEmail()
  toEmail: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  ccList?: string[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bccList?: string[];

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  message: string;
}
