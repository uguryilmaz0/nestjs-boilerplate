import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'E-posta adresi / Email address' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz. / Please provide a valid email.' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'En az 6 karakter / Min 6 characters', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır. / Password must be at least 6 characters.' })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Kullanıcı adı (opsiyonel) / User name (optional)' })
  @IsString()
  @IsOptional()
  name?: string;
}
