import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Kayıtlı e-posta / Registered email' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz. / Please provide a valid email.' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Şifre / Password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır. / Password must be at least 6 characters.' })
  password: string;
}
