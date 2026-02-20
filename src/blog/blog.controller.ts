import { Controller, Get, Post, Query, UseGuards, Body, Patch, Param, ParseIntPipe, Delete, ParseFilePipe, UseInterceptors, UploadedFile, MaxFileSizeValidator, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostsDto } from './dto/create-posts.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdatePostsDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidator } from '../common/validators/image-type.validator';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/roles-decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';

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

  // 🛡️ GÜVENLİK: Bu endpoint sadece geliştirme ve test ortamlarında kullanılabilir / This endpoint is for development/testing only
  @Get('error-test')
  testError() {
    // 🛡️ GÜVENLİK: Üretim ortamında bu endpoint'i pasifize ediyoruz
    if (process.env.NODE_ENV === 'production') {
      throw new NotFoundException('Bu test endpoint\'i üretimde kullanılamaz.');
    }
    throw new Error('Sistem çöktü! / System crashed!');
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
  // ✅ DÜZELTME: 403 yerine artık 404 dönüyoruz (Service'te değiştirdiğimiz için)
  @ApiResponse({ status: 404, description: 'Yazı bulunamadı / Post not found' })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getPostById(id);
  }

  @ApiOperation({ summary: 'Yeni yazı oluştur / Create a new post' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Yazı başarıyla oluşturuldu / Post created successfully' })
  @ApiResponse({ status: 401, description: 'Yetkisiz — JWT token gerekli / Unauthorized — JWT required' })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  async createPost(@GetUser('id') userId: number, @Body() dto: CreatePostsDto) {
    return this.blogService.createPost(userId, dto);
  }

  @ApiOperation({ summary: 'Yazıyı güncelle / Update a post (partial)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Güncellenecek yazı ID / Post ID to update', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı güncellendi / Post updated' })
  // ✅ DÜZELTME: Hata türlerini netleştirdik / Clarified error responses
  @ApiResponse({ status: 404, description: 'Yazı bulunamadı / Post not found' })
  @ApiResponse({ status: 403, description: 'Yetki hatası / Not authorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @GetUser('role') userRole: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostsDto,
  ) {
    return this.blogService.updatePost(userId, userRole, id, dto);
  }

  @ApiOperation({ summary: 'Yazıyı sil / Delete a post (Admin/Author)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Silinecek yazı ID / Post ID to delete', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı silindi / Post deleted' })
  // ✅ DÜZELTME: Burada da 404/403 ayrımını Swagger'a işledik / Added 404/403 distinction to Swagger
  @ApiResponse({ status: 404, description: 'Yazı bulunamadı / Post not found' })
  @ApiResponse({ status: 403, description: 'Yetki hatası / Not authorized' })
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN, Role.AUTHOR)
  delete(@GetUser('id') userId: number, @GetUser('role') userRole: string, @Param('id', ParseIntPipe) id: number) {
    return this.blogService.deletePost(userId, userRole, id);
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
  @UseGuards(JwtGuard, RolesGuard)
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
