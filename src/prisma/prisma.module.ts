import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🌍 Bu, PrismaService'i tüm uygulama için "görünür" kılar.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 🔑 Dışarıya açıyoruz ki AuthService buna ulaşabilsin.
})
export class PrismaModule {}
