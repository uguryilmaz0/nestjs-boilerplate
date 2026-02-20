import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name); // Logger for logging database connection status
  private pool: Pool; // PostgreSQL bağlantı havuzu / PostgreSQL connection pool

  constructor(configService: ConfigService) {
    // Ortam değişkeninden veritabanı URL'sini al / Get DB URL from environment
    const connectionString = configService.get<string>('DATABASE_URL');

    // 1. pg.Pool oluştur / Create pg.Pool
    const poolInstance = new Pool({ connectionString });

    // 2. pg.Pool'u Prisma adapter'ına bağla / Pass pg.Pool to Prisma adapter
    const adapter = new PrismaPg(poolInstance);

    // 3. PrismaClient'i adapter ile başlat / Initialize PrismaClient with adapter
    super({ adapter });

    // 4. pg.Pool örneğini sınıf değişkenine ata / Assign pg.Pool instance to class variable
    this.pool = poolInstance;
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('🚀 Database connection established / Veritabanı bağlantısı kuruldu');
  }

  async onModuleDestroy() {
    // 1. Prisma disconnect
    await this.$disconnect();
    // 2. KRİTİK: pg.Pool kapatılıyor (Memory Leak önleyici)
    await this.pool.end();
    this.logger.warn('🔌 Database connections closed / Veritabanı bağlantıları kapatıldı');
  }
}
