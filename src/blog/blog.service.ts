import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostsDto } from './dto/create-posts.dto';
import { UpdatePostsDto } from './dto/update-post.dto';
import { join } from 'path';
import * as fs from 'fs'; // Fiziksel dosya işlemleri için
import { promisify } from 'util';
import { GetPostsQueryDto } from './dto/get-posts-query.dto';
import slugify from 'slugify';

const unlinkAsync = promisify(fs.unlink); // Silme işlemini asenkron yapmak için

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) { }

  // Get all posts with pagination and optional tag filtering
  async getPosts(query: GetPostsQueryDto) {
    const { page = 1, limit = 10, tag, search } = query;
    const skip = (page - 1) * limit;

    // 🛡️ Dinamik 'where' objesi oluşturma
    const where: any = {
      published: true, // Sadece yayınlanmış yazıları getir
    }

    // Eğer tag varsa ekle
    if (tag) {
      where.tags = {
        some: {
          slug: tag.trim().toLowerCase(), // " TypeScript " -> "typescript"
        }
      }
    }

    // Eğer arama terimi varsa (Başlıkta VEYA İçerikte ara)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } }, // Başlıkta ara
        { content: { contains: search, mode: 'insensitive' } }, // İçerikte ara
      ]
    }

    // Veriyi ve toplam sayıyı paralel olarak çekiyoruz (Performans için)
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: true, // Etiketleri de Json içinde getir
          author: { select: { id: true, name: true } }, // Yazar bilgileri
        },
        orderBy: { createdAt: 'desc' }, // En yeni yazılar önce gelsin

      }),
      this.prisma.post.count({ where }) // Toplam sayıyı filtreye göre alıyoruz
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

  // Get a single post by ID
  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true, // Etiketleri de Json içinden getir
        author: { // Yazar bilgileri
          select: {
            id: true,
            name: true,
            email: true, // Güvenlik için şifreyi getirme
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true, // Yorum yapanın ismi
              }
            }
          },
          orderBy: {
            createdAt: 'desc', // En yeni yorumlar önce gelsin
          }
        }
      }
    })

    if (!post) throw new ForbiddenException('Yazı bulunamadı.');
    return post;
  }

  // Create a new post (Post)
  async createPost(userId: number, dto: CreatePostsDto) {
    // Başlığı temizle ve URL dostu yap
    const baseSlug = slugify(dto.title, { lower: true, strict: true, locale: 'tr' }); // "Merhaba Dünya!" -> "merhaba-dunya"

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        image: dto.image, // 🔥 Yeni ekledik: Resim yolu
        published: dto.published || false,
        authorId: userId, // 🔥 JWT'den gelen User ile bağlantı
        // Çakışma ihtimaline karşı sonuna kısa bir random string veya tarih ekliyoruz
        slug: `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`,
        tags: {
          // Gelen her string tag'i nesneye çeviriyoruz
          connectOrCreate: (dto.tags || []).map((tag) => {
            const normalizedTag = tag.trim().toLowerCase(); // " TypeScript " -> "typescript"
            return {
              where: { slug: normalizedTag },// 🔥 Uniqueness kontrolü slug üzerinden
              create: { slug: normalizedTag, name: tag.trim() },// 🔥 İlk kim yazdıysa o isim kalır (NestJS)
            }
          })
        }
      },
      include: {
        tags: true, // Oluşturulan yazının etiketlerini de Json içinde getir
      }
    })
  }

  // Update a post (Patch)
  async updatePost(userId: number, postId: number, dto: UpdatePostsDto) {
    // 1. Önce yazı var mı ve bu kullanıcıya mı ait kontrolü yapabiliriz
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException('Bu yazıyı güncelleme yetkiniz yok veya yazı bulunamadı.');
    }

    // 2. Eğer yazı varsa güncelleme işlemini yapabiliriz
    return await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
        published: dto.published,
        tags: dto.tags ? {
          set: [], // Önce tüm mevcut etiketleri kaldır
          connectOrCreate: dto.tags.map((tag) => {
            const normalizedTag = tag.trim().toLowerCase(); // " TypeScript " -> "typescript"
            return {
              where: { slug: normalizedTag },// 🔥 Uniqueness kontrolü slug üzerinde
              create: { slug: normalizedTag, name: tag.trim() },// 🔥 İlk kim yazdıysa o isim kalır (NestJS)
            }
          })
        } : undefined,
      },
      include: {
        tags: true, // Güncellenen yazının etiketlerini de Json içinde getir
      }
    })
  }

  // Delete physical image file
  private async deleteImageFile(filePath: string) {
    try {
      // Veritabanında kayıtlı yol: /uploads/resim.jpg
      // Fiziksel yol: C:/.../proje/uploads/resim.jpg
      const fullPath = join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        await unlinkAsync(fullPath);
        console.log(`✅ Dosya başarıyla silindi: ${fullPath}`);
      }
    } catch (error) {
      console.error(`❌ Dosya silinirken hata oluştu: ${error.message}`);
      // Dosya silinemese bile veritabanı işlemi durmasın diye hata fırlatmıyoruz
    }
  }

  // Delete a post (Delete)
  async deletePost(userId: number, postId: number) {
    // 1. Yazıyı bul ve yetki kontrolü yap
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException('Bu yazıyı silme yetkiniz yok veya yazı bulunamadı.');
    }

    // Veritabanından siliyoruz önce
    const deletedPost = await this.prisma.post.delete({
      where: { id: postId },
    })

    // Eğer yazının bir resmi varsa fiziksel dosyayı da silelim
    if (deletedPost.image) {
      await this.deleteImageFile(deletedPost.image);
    }

    return { message: 'Yazı başarıyla silindi.' };
  }
}
