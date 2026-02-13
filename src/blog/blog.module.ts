import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  providers: [BlogService, PrismaService, S3Service],
  controllers: [BlogController],
})
export class BlogModule { }
