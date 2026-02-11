import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @ApiOperation({ summary: 'Yazıya yorum ekle' })
    @ApiResponse({ status: 201, description: 'Yorum başarıyla oluşturuldu' })
    @ApiResponse({ status: 401, description: 'Yetkisiz — JWT token gerekli' })
    @Post()
    async createComment(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
        return await this.commentService.createComment(userId, dto);
    }
}
