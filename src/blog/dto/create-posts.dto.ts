import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostsDto {
    @ApiProperty({ example: 'NestJS ile REST API Geliştirme', description: 'Yazı başlığı' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Bu yazıda NestJS framework ile...', description: 'Yazı içeriği' })
    @IsString()
    @IsNotEmpty()
    content?: string;

    @ApiPropertyOptional({ example: ['nestjs', 'typescript', 'prisma'], description: 'Etiketler', type: [String] })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ example: '/uploads/1234567890.jpg', description: 'Yüklenen resmin yolu' })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiPropertyOptional({ example: false, description: 'Yazının yayın durumu', default: false })
    @IsBoolean()
    @IsOptional()
    published?: boolean;
}