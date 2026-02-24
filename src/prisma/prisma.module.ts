import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Bu, PrismaService'i tüm uygulama için "görünür" kılar. / This makes PrismaService "visible" across the entire application.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Dışarıya açıyoruz ki AuthService buna ulaşabilsin. / We export it so that AuthService can access it.
})
export class PrismaModule { }
