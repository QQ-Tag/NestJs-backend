import { IsString, IsEmail, MinLength, IsOptional, Matches } from 'class-validator';

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export class SignupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @Matches(phoneRegex, { message: 'Invalid phone number' })
  phone?: string;

  @IsOptional()
  @Matches(phoneRegex, { message: 'Invalid WhatsApp number' })
  whatsapp?: string;
}