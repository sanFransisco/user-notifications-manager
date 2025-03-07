import { IsEmail, IsString, IsNumber, IsPhoneNumber, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserContactDto {
  @IsEmail({ message: 'email must be a valid email' })
  public email: string | null;

  @IsNumber()
  public userId: Number;

  @IsPhoneNumber('IL')
  telephone: String | null;

  @IsNotEmpty()
  preferences: NotificationMethodDto | null;
}

export class NotificationMethodDto {
  @IsOptional()
  @IsBoolean({ message: 'email must be a boolean' })
  email: Boolean | null;

  @IsOptional()
  @IsBoolean({ message: 'sms must be a boolean' })
  sms: Boolean | null;
}

export class UpdateContactPreferenceDto {
  email: String | null;
  telephone: String | null;
  preferences: NotificationMethodDto | null;
}
