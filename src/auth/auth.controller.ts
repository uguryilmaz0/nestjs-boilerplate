import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthResponse, AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { UserEntity } from './entity/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: 'Yeni kullanıcı kaydı / Register a new user' })
  @ApiResponse({ status: 201, description: 'Kullanıcı oluşturuldu / User created' })
  @ApiResponse({ status: 403, description: 'E-posta zaten kullanımda / Email already in use' })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Kullanıcı girişi / User login' })
  @ApiResponse({ status: 200, description: 'Başarılı giriş — JWT token döner / Successful login — returns JWT token' })
  @ApiResponse({ status: 403, description: 'Geçersiz kimlik bilgileri / Invalid credentials' })
  @HttpCode(200)
  @Post('signin')
  signin(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.signin(dto);
  }

  @ApiOperation({ summary: 'Mevcut kullanıcı bilgilerini getir / Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Kullanıcı profili / User profile' })
  @ApiResponse({ status: 401, description: 'Yetkisiz — Geçerli JWT token gereklidir / Unauthorized — Valid JWT required' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@GetUser() user: UserEntity) {
    return user;
  }
}
