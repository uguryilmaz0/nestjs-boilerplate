import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(configService: ConfigService) {
    // Ortam değişkeninden veritabanı URL'sini al / Get DB URL from environment
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in .env file');
    }

    // 1. PostgreSQL bağlantı havuzu / PostgreSQL connection pool
    const pool: Pool = new Pool({
      connectionString: connectionString,
    });

    // 2. Prisma PostgreSQL adaptörü / Prisma PostgreSQL adapter
    const adapter: PrismaPg = new PrismaPg(pool);

    // 3. Adaptörü Prisma'ya geç / Pass adapter to Prisma
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Database connection established successfully.');
  }
}
