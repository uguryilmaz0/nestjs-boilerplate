import { IsNotEmpty, IsString, MaxLength, MinLength, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ example: 'Harika bir yazı, çok faydalı oldu!', description: 'Yorum içeriği (3-500 karakter)' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    @MinLength(3)
    content: string;

    @ApiProperty({ example: 1, description: 'Yorumun yapılacağı yazının ID değeri' })
    @IsNotEmpty()
    @IsInt()
    postId: number;
}