import { IsEmail, IsNumber, IsPhoneNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class NotificationMethodDto {
  @IsOptional()
  @IsBoolean({ message: 'email flag is a boolean' })
  email: Boolean | null;

  @IsOptional()
  @IsBoolean({ message: 'sms flag is a boolean' })
  sms: Boolean | null;
}

export class CreateUserContactDto {
  @IsEmail({ message: 'email must be a valid' })
  @IsOptional()
  public email: string | null;

  @IsNumber()
  public userId: Number;

  @IsPhoneNumber('IL')
  @IsOptional()
  telephone: String | null;

  @IsOptional()
  preferences: NotificationMethodDto | null;
}

export class UpdateContactPreferenceDto {
  @IsString()
  email: String | null;

  @IsPhoneNumber('IL')
  telephone: String | null;

  @IsOptional()
  preferences: NotificationMethodDto | null;
}

export class SendNotificationDto {
  @IsNumber()
  userId: Number | null;

  @IsString()
  message: String | null;
}
