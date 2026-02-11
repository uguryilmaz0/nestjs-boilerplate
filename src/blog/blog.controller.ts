import { Controller, Get, Post, Query, UseGuards, Body, Patch, Param, ParseIntPipe, Delete, ParseFilePipe, UseInterceptors, UploadedFile, MaxFileSizeValidator, BadRequestException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostsDto } from './dto/create-posts.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UpdatePostsDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageValidator } from 'src/common/validators/image-type.validator';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles-decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @ApiOperation({ summary: 'Yazılarda arama yap' })
  @ApiQuery({ name: 'q', description: 'Arama terimi', example: 'NestJS' })
  @ApiResponse({ status: 200, description: 'Arama sonuçları' })
  @Get('search')
  search(@Query('q') q: string) {
    return this.blogService.getPosts({ search: q, page: 1, limit: 10 });
  }

  @ApiOperation({ summary: 'Tüm yazıları listele (sayfalama, arama, etiket filtresi)' })
  @ApiResponse({ status: 200, description: 'Yazı listesi ve meta bilgileri' })
  @Get()
  getAll(@Query() query: GetPostsQueryDto) {
    return this.blogService.getPosts(query);
  }

  @ApiOperation({ summary: 'Tek bir yazıyı getir (yorumlar dahil)' })
  @ApiParam({ name: 'id', description: 'Yazı ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı detayı' })
  @ApiResponse({ status: 403, description: 'Yazı bulunamadı' })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getPostById(id);
  }

  @ApiOperation({ summary: 'Yeni yazı oluştur' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Yazı başarıyla oluşturuldu' })
  @ApiResponse({ status: 401, description: 'Yetkisiz — JWT token gerekli' })
  @UseGuards(JwtGuard)
  @Post('create')
  async createPost(@GetUser('id') userId: number, @Body() dto: CreatePostsDto) {
    return this.blogService.createPost(userId, dto);
  }

  @ApiOperation({ summary: 'Yazıyı güncelle (kısmi güncelleme)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Güncellenecek yazı ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı güncellendi' })
  @ApiResponse({ status: 403, description: 'Yetki hatası veya yazı bulunamadı' })
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostsDto,
  ) {
    return this.blogService.updatePost(userId, id, dto);
  }

  @ApiOperation({ summary: 'Yazıyı sil (Admin/Author)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Silinecek yazı ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Yazı silindi' })
  @ApiResponse({ status: 403, description: 'Yetki hatası veya yazı bulunamadı' })
  @UseGuards(JwtGuard)
  @Delete(':id')
  @Roles(Role.ADMIN, Role.AUTHOR)
  delete(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.blogService.deletePost(userId, id);
  }

  @ApiOperation({ summary: 'Resim yükle (max 2MB, jpg/png/gif)' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Resim dosyası' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Resim yüklendi — dosya yolu döner' })
  @ApiResponse({ status: 400, description: 'Geçersiz dosya tipi veya boyut aşımı' })
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Yalnızca resim dosyaları (jpg, jpeg, png, gif) yüklenebilir.'), false);
      }
      cb(null, true);
    },
  }))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new ImageValidator(),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return { imageUrl: `/uploads/${file.filename}` };
  }
}
