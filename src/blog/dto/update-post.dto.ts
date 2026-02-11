import { PartialType } from '@nestjs/swagger';
import { CreatePostsDto } from './create-posts.dto';

// PartialType tüm alanları opsiyonel yapar ve Swagger şemasını otomatik üretir
export class UpdatePostsDto extends PartialType(CreatePostsDto) { }