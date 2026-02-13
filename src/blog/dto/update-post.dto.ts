import { PartialType } from '@nestjs/swagger';
import { CreatePostsDto } from './create-posts.dto';

// PartialType tüm alanları opsiyonel yapar ve Swagger şemasını üretir
// PartialType makes all fields optional and auto-generates Swagger schema
export class UpdatePostsDto extends PartialType(CreatePostsDto) { }