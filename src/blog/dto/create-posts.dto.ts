import { IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostsDto {
    @ApiProperty({ example: 'NestJS ile REST API Geliştirme', description: 'Yazı başlığı / Post title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Bu yazıda NestJS framework ile...', description: 'Yazı içeriği / Post content' })
    @IsString()
    @IsNotEmpty()
    content?: string;

    @ApiPropertyOptional({ example: ['nestjs', 'typescript', 'prisma'], description: 'Etiketler / Tags', type: [String] })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ example: '/uploads/1234567890.jpg', description: 'S3 resim URL / Uploaded image URL' })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiPropertyOptional({ example: false, description: 'Yayın durumu / Published status', default: false })
    @IsBoolean()
    @IsOptional()
    published?: boolean;
}