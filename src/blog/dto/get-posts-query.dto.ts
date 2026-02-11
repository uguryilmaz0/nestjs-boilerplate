import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Sayfa numarası', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Sayfa başına kayıt sayısı', minimum: 1, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'nestjs', description: 'Başlık ve içerikte arama' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'typescript', description: 'Etiket slug ile filtreleme' })
  @IsOptional()
  @IsString()
  tag?: string;
}
