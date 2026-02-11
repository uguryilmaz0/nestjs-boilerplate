import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config(); // .env dosyasını yükler

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
