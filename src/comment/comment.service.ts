import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) { }

    // Yorum oluştur / Create a comment
    async createComment(userId: number, dto: CreateCommentDto) {
        return await this.prisma.comment.create({
            data: {
                content: dto.content,
                postId: dto.postId,
                authorId: userId, // JWT'den gelen kullanıcı ID / User ID from JWT
            }
        })
    }
}
