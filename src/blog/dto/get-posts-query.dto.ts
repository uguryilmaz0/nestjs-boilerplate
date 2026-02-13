import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Sayfa numarası / Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Sayfa başına kayıt / Items per page', minimum: 1, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'nestjs', description: 'Başlık ve içerikte arama / Search in title & content' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'typescript', description: 'Etiket ile filtreleme / Filter by tag slug' })
  @IsOptional()
  @IsString()
  tag?: string;
}
