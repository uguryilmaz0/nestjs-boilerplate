import {
  Controller, Get, Post, Query, UseGuards, Body, Patch,
  Param, ParseIntPipe, Delete, ParseFilePipe, UseInterceptors,
  UploadedFile, MaxFileSizeValidator, NotFoundException
} from '@nestjs/common';
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
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth,
  ApiConsumes, ApiBody, ApiParam, ApiQuery
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';

/**
 * Blog Yönetim Paneli: Yazı oluşturma, listeleme, güncelleme ve silme işlemlerini yönetir.
 * Blog Management Controller: Handles post creation, listing, updating, and deletion.
 */
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  /**
   * Yazılarda anahtar kelimeye göre arama yapar.
   * Searches for posts based on a specific keyword.
   */
  @ApiOperation({ summary: 'Yazılarda arama yap / Search posts' })
  @ApiQuery({ name: 'q', description: 'Arama terimi / Search term', example: 'NestJS' })
  @ApiResponse({ status: 200, description: 'Arama sonuçları başarıyla getirildi / Search results retrieved successfully' })
  @Get('search')
  searchPosts(@Query('q') q: string) {
    return this.blogService.getPosts({ search: q, page: 1, limit: 10 });
  }

  /**
   * Hata yakalama mekanizmasını test etmek için kullanılan diagnostik endpoint.
   * Diagnostic endpoint used to test the error handling mechanism.
   * !!!! GÜVENLİK/SECURITY: Üretim ortamında pasifize edilmiştir / Disabled in production. !!!!
   */
  @ApiOperation({ summary: 'Hata test endpointi / Error testing diagnostic' })
  @Get('error-test')
  testErrorHandling() {
    if (process.env.NODE_ENV === 'production') {
      throw new NotFoundException('Bu test endpoint\'i üretimde kullanılamaz. / This test endpoint is unavailable in production.');
    }
    throw new Error('Sistem hata simülasyonu tetiklendi! / System error simulation triggered!');
  }

  /**
   * Sayfalama ve filtreleme seçenekleriyle tüm yazıları listeler.
   * Lists all posts with pagination and filtering options.
   */
  @ApiOperation({ summary: 'Yazıları listele / List posts' })
  @ApiResponse({ status: 200, description: 'Yazı listesi ve meta veriler / Post list and metadata' })
  @Get()
  getAllPosts(@Query() query: GetPostsQueryDto) {
    return this.blogService.getPosts(query);
  }

  /**
   * Belirli bir ID'ye sahip yazının detaylarını getirir.
   * Retrieves the details of a post by its specific ID.
   */
  @ApiOperation({ summary: 'Yazı detayı getir / Get post details' })
  @ApiParam({ name: 'id', description: 'Benzersiz Yazı ID / Unique Post ID' })
  @ApiResponse({ status: 200, description: 'Yazı detayı bulundu / Post details found' })
  @ApiResponse({ status: 404, description: 'Belirtilen ID ile yazı bulunamadı / Post with specified ID not found' })
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getPostById(id);
  }

  /**
   * Yeni bir blog yazısı oluşturur. Kimlik doğrulaması gerektirir.
   * Creates a new blog post. Requires authentication.
   */
  @ApiOperation({ summary: 'Yeni yazı oluştur / Create post' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Yazı başarıyla oluşturuldu / Post successfully created' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulaması başarısız / Authentication failed' })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  async createNewPost(
    @GetUser('id') userId: number,
    @Body() dto: CreatePostsDto
  ) {
    return this.blogService.createPost(userId, dto);
  }

  /**
   * Mevcut bir yazıyı günceller. Sadece yetkili kullanıcılar işlem yapabilir.
   * Updates an existing post. Only authorized users can perform this action.
   */
  @ApiOperation({ summary: 'Yazıyı güncelle / Update post' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Güncellenecek yazı ID / ID of post to update' })
  @ApiResponse({ status: 200, description: 'Güncelleme başarılı / Update successful' })
  @ApiResponse({ status: 403, description: 'Bu işlem için yetkiniz yok / You do not have permission for this action' })
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  updateExistingPost(
    @GetUser('id') userId: number,
    @GetUser('role') userRole: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostsDto,
  ) {
    return this.blogService.updatePost(userId, userRole, id, dto);
  }

  /**
   * Belirtilen yazıyı kalıcı olarak siler (Admin veya Yazar yetkisi gerekir).
   * Permanently deletes the specified post (Requires Admin or Author role).
   */
  @ApiOperation({ summary: 'Yazıyı sil / Delete post' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Yazı başarıyla silindi / Post successfully deleted' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.AUTHOR)
  @Delete(':id')
  deleteExistingPost(
    @GetUser('id') userId: number,
    @GetUser('role') userRole: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.blogService.deletePost(userId, userRole, id);
  }

  /**
   * Yazı için resim dosyası yükler (S3/MinIO entegrasyonu).
   * Uploads an image file for a post (S3/MinIO integration).
   * 📏 Limit: 2MB | 🖼️ Formats: jpg, png, gif
   */
  @ApiOperation({ summary: 'Görsel yükle / Upload image' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Yüklenecek resim dosyası / Image file to upload',
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Görsel yüklendi ve URL döndürüldü / Image uploaded and URL returned' })
  @UseGuards(JwtGuard, RolesGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadPostImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB Limit
          new ImageValidator(), // Özel dosya tipi kontrolü / Custom file type validation
        ]
      })
    )
    file: Express.Multer.File,
  ) {
    const url = await this.blogService.uploadToS3(file);
    return { imageUrl: url };
  }
}