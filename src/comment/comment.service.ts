import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) { }

    // Yorum oluştur / Create a comment
    async createComment(userId: number, dto: CreateCommentDto) {
        const post = await this.prisma.post.findUnique({
            where: { id: dto.postId },
        })
        if (!post) {
            throw new NotFoundException('Yazı bulunamadı / Post not found');
        }
        return await this.prisma.comment.create({
            data: {
                content: dto.content,
                postId: dto.postId,
                authorId: userId, // JWT'den gelen kullanıcı ID / User ID from JWT
            }
        })
    }

    // Yorumu sil / Delete a comment
    async removeComment(userId: number, commentId: number) {
        // 1. Önce yorumun kime ait olduğunu ve yazının sahibini tek seferde çekiyoruz (Performance: 1 Fetch)
        // Fetching comment owner and post owner in a single query
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                authorId: true, // Yorumun sahibi / Comment owner
                post: {
                    select: {
                        authorId: true, // Yazının sahibi / Post owner
                    }
                }
            }
        })

        // 2. Yorum yoksa hata fırlat / Throw if comment not found
        if (!comment) {
            throw new NotFoundException('Yorum bulunamadı / Comment not found');
        }

        // 3. Yetki kontrolü: Yorum sahibi mi VEYA Yazı sahibi mi?
        // Check if current user is comment author OR post author
        const isCommentAuthor = comment.authorId === userId;
        const isPostOwner = comment.post.authorId === userId;

        if (!isCommentAuthor && !isPostOwner) {
            throw new ForbiddenException('Bu işlem için yetkiniz yok / Not authorized');
        }

        // 4. Yorum sil / Delete the comment
        await this.prisma.comment.delete({
            where: { id: commentId },
        })
    }
}
