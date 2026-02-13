import { Controller, Get, Post, Query, UseGuards, Body, Patch, Param, ParseIntPipe, Delete, ParseFilePipe, UseInterceptors, UploadedFile, MaxFileSizeValidator } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostsDto } from './dto/create-posts.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UpdatePostsDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidator } from 'src/common/validators/image-type.validator';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles-decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @ApiOperation({ summary: 'Yazılarda arama yap / Search posts' })
  @ApiQuery({ name: 'q', description: 'Arama terimi / Search term', example: 'NestJS' })
  @ApiResponse({ status: 200, description: 'Arama sonuçları / Search results' })
  @Get('search')
  search(@Query('q') q: string) {
    return this.blogService.getPosts({ search: q, page: 1, limit: 10 });
  }

  @ApiOperation({ summary: 'Tüm yazıları listele / List all posts (pagination, search, tag filter)' })
  @ApiResponse({ status: 200, description: 'Yazı listesi ve meta bilgileri / Post list with metadata' })
  @Get()
  getAll(@Query() query: GetPostsQueryDto) {
    return this.blogService.getPosts(query);
  }

  @ApiOperation({ summary: 'Tek bir yazıyı getir / Get a single post (with comments)' })
  @ApiParam({ name: 'id', description: 'Yazı ID / Post ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı detayı / Post details' })
  @ApiResponse({ status: 403, description: 'Yazı bulunamadı / Post not found' })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getPostById(id);
  }

  @ApiOperation({ summary: 'Yeni yazı oluştur / Create a new post' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Yazı başarıyla oluşturuldu / Post created successfully' })
  @ApiResponse({ status: 401, description: 'Yetkisiz — JWT token gerekli / Unauthorized — JWT required' })
  @UseGuards(JwtGuard)
  @Post('create')
  async createPost(@GetUser('id') userId: number, @Body() dto: CreatePostsDto) {
    return this.blogService.createPost(userId, dto);
  }

  @ApiOperation({ summary: 'Yazıyı güncelle / Update a post (partial)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Güncellenecek yazı ID / Post ID to update', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı güncellendi / Post updated' })
  @ApiResponse({ status: 403, description: 'Yetki hatası veya yazı bulunamadı / Not authorized or post not found' })
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostsDto,
  ) {
    return this.blogService.updatePost(userId, id, dto);
  }

  @ApiOperation({ summary: 'Yazıyı sil / Delete a post (Admin/Author)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Silinecek yazı ID / Post ID to delete', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı silindi / Post deleted (soft delete)' })
  @ApiResponse({ status: 403, description: 'Yetki hatası veya yazı bulunamadı / Not authorized or post not found' })
  @UseGuards(JwtGuard)
  @Delete(':id')
  @Roles(Role.ADMIN, Role.AUTHOR)
  delete(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.blogService.deletePost(userId, id);
  }

  @ApiOperation({ summary: 'Resim yükle / Upload image (max 2MB, jpg/png/gif)' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Resim dosyası / Image file' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Resim yüklendi — URL döner / Image uploaded — returns URL' })
  @ApiResponse({ status: 400, description: 'Geçersiz dosya tipi veya boyut aşımı / Invalid file type or size exceeded' })
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new ImageValidator(), // Sadece jpg/png/gif izin ver
        ]
      })
    )
    file: Express.Multer.File,
  ) {
    const url = await this.blogService.uploadToS3(file);
    return { imageUrl: url };
  }
}
