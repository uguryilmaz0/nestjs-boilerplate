import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: PrismaService,
          useValue: {
            // Mock PrismaService methods used in CommentService for testing
            // PrismaService'nin CommentService içinde kullanılan yöntemlerini test için mockladık
            post: {
              findUnique: jest.fn(),
            },
            comment: {
              create: jest.fn(),
              findUnique: jest.fn(), // removeComment testleri için ekledik / added for removeComment tests
              delete: jest.fn(), // removeComment testleri için ekledik / added for removeComment tests
            },
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---- Test for createComment method / Test için yorum oluşturma methodu ----
  describe('createComment', () => {
    const userId = 1;
    const dto = {
      content: 'Test comment / Test Yorum',
      postId: 10,
    };

    // Test: Yazı bulunamazsa NotFoundException fırlatmalı / Test: should throw NotFoundException if post not found
    it('yazı bulunamazsa NotFoundException fırlatmalı / should throw NotFoundException if post not found', async () => {
      // ARRANGE / Hazırlık: findUnique null dönsün (yazı yok)
      // ARRANGE: findUnique returns null (post doesn't exist)
      jest.mocked(prisma.post.findUnique).mockResolvedValue(null);

      // ACT & ASSERT / Çalıştırma ve Doğrulama
      await expect(service.createComment(userId, dto)).rejects.toThrow(NotFoundException);

      // Yazı kontrolünün yapıldığını doğrula / Verify that post check was performed
      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: dto.postId },
      })
    });

    // Test: Başarılı yorum oluşturma / Test: should create comment successfully
    it('başarılı yorum oluşturma / should create comment successfully', async () => {
      const mockPost = { id: dto.postId, title: 'Test Post', content: '...' };
      const mockComment = {
        id: 1,
        ...dto,
        authorId: userId,
      }

      // ARRANGE: Önce yazı bulunsun, sonra yorum oluşturulsun
      // ARRANGE: First find the post, then create the comment
      jest.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);
      jest.mocked(prisma.comment.create).mockResolvedValue(mockComment as any);

      // ACT / Çalıştırma
      const result = await service.createComment(userId, dto);

      // ASSERT / Doğrulama
      expect(result).toEqual(mockComment);
      expect(prisma.comment.create).toHaveBeenCalledTimes(1);
    });
  });

  // ---- Test for removeComment method / Yorum silme methodu testleri ----
  describe('removeComment', () => {
    const userId = 1;
    const commentId = 100;

    it('yorum bulunamazsa NotFoundException fırlatmalı / should throw NotFoundException if comment not found', async () => {
      // ARRANGE: findUnique null dönsün (yorum yok)
      // ARRANGE: findUnique returns null (comment doesn't exist)
      jest.mocked(prisma.comment.findUnique).mockResolvedValue(null);

      // ACT & ASSERT / Çalıştırma ve Doğrulama
      await expect(service.removeComment(userId, commentId)).rejects.toThrow(NotFoundException);
    })

    it('yetkisiz bir kullanıcı silmeye çalışırsa ForbiddenException fırlatmalı / should throw ForbiddenException for unauthorized user', async () => {
      // ARRANGE: Yorum var ama ne yorumun ne de yazının sahibi kullanıcı değil
      // ARRANGE: Comment exists but user is neither comment author nor post owner
      jest.mocked(prisma.comment.findUnique).mockResolvedValue({
        authorId: 2, // Yorum sahibi farklı / Comment author is different
        post: {
          authorId: 3, // Yazı sahibi farklı / Post owner is different
        }
      } as any);

      // ACT & ASSERT / Çalıştırma ve Doğrulama
      await expect(service.removeComment(userId, commentId)).rejects.toThrow(ForbiddenException);

      // Veritabanına silme isteği gitmediğini doğrula / Verify delete was never called
      expect(prisma.comment.delete).not.toHaveBeenCalled();
    })

    it('yorumun sahibi yorumu silebilmeli / should allow comment owner to delete', async () => {
      // ARRANGE: Kullanıcı yorumun sahibi / ARRANGE: User is the comment author
      jest.mocked(prisma.comment.findUnique).mockResolvedValue({
        authorId: userId, // Yorum sahibi / Comment author is the user
        post: {
          authorId: 3, // Yazı sahibi farklı / Post owner is different
        }
      } as any);

      // ACT / Çalıştırma
      await service.removeComment(userId, commentId);

      // ASSERT / Doğrulama
      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: commentId },
      })
    })

    it('yazının sahibi yorumu silebilmeli / should allow post owner to delete someone elses comment', async () => {
      // ARRANGE: Kullanıcı yazının sahibi ama yorum başkasının 
      // ARRANGE: User is the post owner but comment author is different

      jest.mocked(prisma.comment.findUnique).mockResolvedValue({
        authorId: 2, // Yorum sahibi farklı / Comment author is different
        post: {
          authorId: userId, // Yazı sahibi / Post owner is the user
        }
      } as any);

      // ACT / Çalıştırma
      await service.removeComment(userId, commentId);

      // ASSERT / Doğrulama
      expect(prisma.comment.delete).toHaveBeenCalledWith({
        where: { id: commentId },
      })
    })
  })
});