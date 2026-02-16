import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostsDto } from './dto/create-posts.dto';
import { UpdatePostsDto } from './dto/update-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import slugify from 'slugify';
import { S3Service } from 'src/common/services/s3.service';
import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService, private s3Service: S3Service) { }

  // Tüm yazıları sayfalama ve opsiyonel filtreleme ile getir
  // Get all posts with pagination and optional tag filtering
  async getPosts(query: GetPostsQueryDto) {
    const { page = 1, limit = 10, tag, search } = query;
    const skip = (page - 1) * limit;

    // Dinamik 'where' objesi oluşturma / Build dynamic 'where' object
    const where: any = {
      published: true, // Sadece yayınlanmış yazıları getir / Only published posts
      deletedAt: null, // Soft delete filtresi / Soft delete filter
    }

    // Etiket filtresi / Tag filter
    if (tag) {
      where.tags = {
        some: {
          slug: tag.trim().toLowerCase(), // " TypeScript " -> "typescript"
        }
      }
    }

    // PostgreSQL tsvector ile tam metin araması / Full-text search using PostgreSQL tsvector
    if (search) {
      where.OR = [
        { title: { search: search.split(' ').join(' & ') } },
        { content: { search: search.split(' ').join(' & ') } },
      ]
    }

    // Veri ve toplam sayıyı paralel çek (performans) / Fetch data & count in parallel
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: true, // Etiketleri dahil et / Include tags
          author: { select: { id: true, name: true } }, // Yazar bilgileri / Author info
        },
        orderBy: { createdAt: 'desc' }, // En yeni önce / Newest first
      }),
      this.prisma.post.count({ where }) // Filtreye göre toplam / Total by filter
    ])

    return {
      data: posts,
      meta: {
        totalItems: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    }
  }

  // ID ile tek bir yazıyı getir / Get a single post by ID
  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId, deletedAt: null }, // Soft delete filtresi / Soft delete filter
      include: {
        tags: true, // Etiketleri dahil et / Include tags
        author: { // Yazar bilgileri / Author info
          select: {
            id: true,
            name: true,
            email: true, // Şifre hariç / Excludes password
          }
        },
        comments: {
          where: { deletedAt: null }, // Silinmiş yorumları hariç tut / Exclude soft-deleted comments
          include: {
            author: {
              select: {
                id: true,
                name: true, // Yorum sahibi / Commenter name
              }
            }
          },
          orderBy: {
            createdAt: 'desc', // En yeni yorumlar önce / Newest comments first
          }
        }
      }
    })

    if (!post) throw new ForbiddenException('Yazı bulunamadı. / Post not found.');
    return post;
  }

  // Yeni yazı oluştur / Create a new post
  async createPost(userId: number, dto: CreatePostsDto) {
    // Başlıktan SEO-uyumlu slug oluştur / Generate SEO-friendly slug from title
    const baseSlug = slugify(dto.title, { lower: true, strict: true, locale: 'tr' });

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        image: dto.image, // S3 resim URL'si / S3 image URL
        published: dto.published || false,
        authorId: userId, // JWT'den gelen kullanıcı / User from JWT
        // Çakışma önleme: rastgele son ek / Collision prevention: random suffix
        slug: `${baseSlug}-${randomUUID().split('-')[0]}`, // "hello-world-1a2b3c"
        tags: {
          // Etiketleri bul veya oluştur / Find or create tags
          connectOrCreate: (dto.tags || []).map((tag) => {
            const normalizedTag = tag.trim().toLowerCase();
            return {
              where: { slug: normalizedTag }, // Slug ile benzersizlik / Uniqueness by slug
              create: { slug: normalizedTag, name: tag.trim() },
            }
          })
        }
      },
      include: {
        tags: true, // Etiketleri dahil et / Include tags
      }
    })
  }

  // Yazıyı güncelle (kısmi) / Update a post (partial)
  async updatePost(userId: number, userRole: string, postId: number, dto: UpdatePostsDto) {
    // 1. Yazı varlığı ve sahiplik kontrolü / Check post existence & ownership
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    const isOwner = post?.authorId === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!post || (!isOwner && !isAdmin)) {
      throw new ForbiddenException('Bu yazıyı güncelleme yetkiniz yok veya yazı bulunamadı. / Not authorized or post not found.');
    }

    // 2. Güncelleme işlemi / Perform update
    return await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published,
        tags: dto.tags ? {
          set: [], // Mevcut etiketleri kaldır / Remove current tags
          connectOrCreate: dto.tags.map((tag) => {
            const normalizedTag = tag.trim().toLowerCase();
            return {
              where: { slug: normalizedTag },
              create: { slug: normalizedTag, name: tag.trim() },
            }
          })
        } : undefined,
      },
      include: {
        tags: true, // Etiketleri dahil et / Include tags
      }
    })
  }

  // Yazıyı sil (soft delete) / Delete a post (soft delete)
  async deletePost(userId: number, userRole: string, postId: number) {
    // 1. Yazıyı bul ve yetki kontrolü / Find post & check ownership
    const post = await this.prisma.post.findUnique({
      where: { id: postId, deletedAt: null },
    })

    const isOwner = post?.authorId === userId;
    const isAdmin = userRole === Role.ADMIN;

    if (!post || (!isOwner && !isAdmin)) {
      throw new ForbiddenException('Bu yazıyı silme yetkiniz yok veya yazı bulunamadı. / Not authorized or post not found.');
    }

    // 2. Soft delete: deletedAt alanını doldur / Populate deletedAt field
    await this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    })

    // 3. S3'teki resmi sil / Delete image from S3
    // Not: Üretimde kuyruk sistemi (BullMQ) kullanılabilir / Note: Use queue (BullMQ) in production
    if (post.image) {
      await this.s3Service.deleteFile(post.image);
    }

    return { message: 'Yazı başarıyla silindi. / Post deleted successfully (soft delete).' };
  }

  // Resim yükle (S3) / Upload image to S3
  async uploadToS3(file: Express.Multer.File) {
    return await this.s3Service.uploadFile(file);
  }
}
