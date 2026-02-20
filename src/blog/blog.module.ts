import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { S3Service } from '../common/services/s3.service';

@Module({
  providers: [BlogService, S3Service],
  controllers: [BlogController],
})
export class BlogModule { }
