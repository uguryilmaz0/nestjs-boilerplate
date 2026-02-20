import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @ApiOperation({ summary: 'Yazıya yorum ekle / Add a comment to a post' })
    @ApiResponse({ status: 201, description: 'Yorum oluşturuldu / Comment created' })
    @ApiResponse({ status: 401, description: 'Yetkisiz — JWT token gerekli / Unauthorized — JWT required' })
    @Post()
    async createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
        return await this.commentService.createComment(userId, dto);
    }
}
