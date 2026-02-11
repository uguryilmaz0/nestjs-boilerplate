import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BlogService, PrismaService],
  controllers: [BlogController],
})
export class BlogModule {}
