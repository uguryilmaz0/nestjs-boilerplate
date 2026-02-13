import { IsNotEmpty, IsString, MaxLength, MinLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ example: 'Harika bir yazı, çok faydalı oldu!', description: 'Yorum içeriği (3-500 karakter) / Comment content (3-500 chars)' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    @MinLength(3)
    content: string;

    @ApiProperty({ example: 1, description: 'Yazı ID / Post ID to comment on' })
    @IsNotEmpty()
    @IsInt()
    postId: number;
}