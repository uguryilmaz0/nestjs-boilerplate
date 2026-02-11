import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    // ConfigService kullanıyoruz
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in .env file');
    }

    // 1. Pool tipini açıkça belirtiyoruz
    const pool: Pool = new Pool({
      connectionString: connectionString,
    });

    // 2. Adaptör tipini belirtiyoruz
    const adapter: PrismaPg = new PrismaPg(pool);

    // 3. super() çağrısına bu adaptörü geçiyoruz
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🚀 NestJS Config ile Veritabanı Bağlantısı Başarılı!');
  }
}
