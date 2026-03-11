import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    // Yazıya yeni bir yorum ekler.
    // Adds a new comment to a post.
    @ApiOperation({ summary: 'Yazıya yorum ekle / Add a comment to a post' })
    @ApiResponse({ status: 201, description: 'Yorum başarıyla oluşturuldu / Comment created successfully' })
    @Post()
    async createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
        return await this.commentService.createComment(userId, dto);
    }

    // Yorumu siler.
    // Deletes a comment.
    @ApiOperation({ summary: 'Yorumu sil / Delete a comment' })
    @ApiParam({ name: 'id', description: 'Silinecek yorum ID / Comment ID to delete', example: 1 })
    @ApiResponse({ status: 200, description: 'Yorum başarıyla silindi / Comment successfully deleted' })
    @ApiResponse({ status: 404, description: 'Yorum bulunamadı / Comment not found' })
    @ApiResponse({ status: 403, description: 'Bu işlem için yetkiniz yok / Not authorized for this action' })
    @Delete(':id')
    async deleteComment(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.commentService.removeComment(userId, id);
    }
}
