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

  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
  @ApiResponse({ status: 403, description: 'E-posta zaten kullanımda' })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Başarılı giriş — JWT token döner' })
  @ApiResponse({ status: 403, description: 'Geçersiz kimlik bilgileri' })
  @HttpCode(200)
  @Post('signin')
  signin(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.signin(dto);
  }

  @ApiOperation({ summary: 'Mevcut kullanıcı bilgilerini getir' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Kullanıcı profili' })
  @ApiResponse({ status: 401, description: 'Yetkisiz — Geçerli JWT token gereklidir' })
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@GetUser() user: UserEntity) {
    return user;
  }
}
