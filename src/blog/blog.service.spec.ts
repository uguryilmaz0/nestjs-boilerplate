import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../common/services/s3.service';
import { Role } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('BlogService', () => {
    let service: BlogService;
    let prisma: PrismaService;
    let s3Service: S3Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BlogService,
                {
                    provide: PrismaService,
                    useValue: {
                        post: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            count: jest.fn(),
                        }
                    }
                },
                {
                    provide: S3Service,
                    useValue: {
                        uploadFile: jest.fn(),
                        deleteFile: jest.fn(),
                    }
                }
            ]
        }).compile();

        service = module.get<BlogService>(BlogService);
        prisma = module.get<PrismaService>(PrismaService);
        s3Service = module.get<S3Service>(S3Service);
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ---- getPosts Testleri / Tests for getPosts ----
    describe('getPosts', () => {
        const query = { page: 1, limit: 10 };
        const mockPosts = [
            { id: 1, title: 'Test Post 1', content: 'Content 1', published: true, deletedAt: null },
            { id: 2, title: 'Test Post 2', content: 'Content 2', published: true, deletedAt: null },
        ]
        const mockTotalCount = 2;

        it('yayınlanmış ve silinmemiş yazıları döndürmeli / should return published and non-deleted posts', async () => {
            // ARRANGE: Promise.all içindeki findMany ve count'u mockluyoruz
            // Mocking findMany and count used within Promise.all
            jest.mocked(prisma.post.findMany).mockResolvedValue(mockPosts as any);
            jest.mocked(prisma.post.count).mockResolvedValue(mockTotalCount);

            // ACT: getPosts'u çağırıyoruz
            // Calling getPosts
            const result = await service.getPosts(query);

            // ASSERT: Sonuçların beklenen şekilde olduğunu doğruluyoruz
            // Verifying results are as expected
            expect(result.data).toEqual(mockPosts);
            expect(result.meta.totalItems).toBe(mockTotalCount);
            expect(result.meta.totalPages).toBe(Math.ceil(mockTotalCount / query.limit));

            // Prisma'nın varsayılan filtrelerle (published: true, deletedAt: null) çağrıldığını doğruladık
            // Verifying Prisma was called with default filters (published: true, deletedAt: null)
            expect(prisma.post.findMany).toHaveBeenCalledWith(expect.objectContaining({
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                where: expect.objectContaining({
                    published: true,
                    deletedAt: null,
                }),
            }))
        });

        it('arama parametresi (search) verildiğinde doğru filtreyi uygulamalı / should apply search filter', async () => {
            // Arama parametresi ekleyelim / Adding search parameter
            const searchQuery = { ...query, search: 'NestJS' };

            // ARRANGE: findMany ve count'u arama parametresiyle mockluyoruz
            // Mocking findMany and count with search parameter
            jest.mocked(prisma.post.findMany).mockResolvedValue([]);
            jest.mocked(prisma.post.count).mockResolvedValue(0);

            // ACT: getPosts'u arama parametresi ile çağırıyoruz
            // Calling getPosts with search parameter
            await service.getPosts(searchQuery);

            // ASSERT: OR operatörü ile title veya content içinde arama yapıldığını kontrol et
            // Verifying that search is applied with OR operator on title or content
            expect(prisma.post.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    OR: [
                        { title: { search: 'NestJS' } },
                        { content: { search: 'NestJS' } },
                    ]
                })
            }))
        })
    })

    // ---- getPostById Testleri / Tests for getPostById ----
    describe('getPostById', () => {
        it('ID ile yazıyı getirmeli / should return post by ID', async () => {
            // ARRANGE: findUnique'u mockluyoruz, ID ile yazıyı döndürmesini sağlıyoruz
            // Mocking findUnique to return a post by ID
            const mockPost = {
                id: 1,
                title: 'Test Post',
                content: 'Test Content',
                published: true,
                deletedAt: null,
            };

            // ARRANGE: findUnique'u mockluyoruz, ID ile yazıyı döndürmesini sağlıyoruz
            // Mocking findUnique to return a post by ID
            jest.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);

            const result = await service.getPostById(1);
            expect(result).toEqual(mockPost);
        })

        it('Yazı bulunamazsa NotFoundException fırlatmalı / should throw NotFoundException if post not found', async () => {
            // ARRANGE: findUnique'u mockluyoruz, null döndürmesini sağlıyoruz (yazı bulunamaz)
            // Mocking findUnique to return null (post not found)
            jest.mocked(prisma.post.findUnique).mockResolvedValue(null);
            await expect(service.getPostById(99)).rejects.toThrow(NotFoundException);
        })
    })

    // ---- createPost Testleri / Tests for createPost ----
    describe('createPost', () => {
        const userId = 1;
        const dto = {
            title: 'Great Post',
            content: 'This is a new post.',
            tags: ['nestjs', 'testing'],
        }

        it('başarıyla yazı oluşturmalı ve SEO uyumlu slug üretmeli / should create post successfully and generate SEO-friendly slug', async () => {
            // ARRANGE: create methodunu mockluyoruz, slug'ın beklenen formatta olduğunu kontrol edeceğiz
            // Mocking create method, we will verify the slug format
            jest.mocked(prisma.post.create).mockResolvedValue({
                id: 1,
                ...dto,
                slug: 'great-post-a1b2c3d4',
            } as any);

            // ACT: createPost'u çağırıyoruz
            // Calling createPost
            const result = await service.createPost(userId, dto as any);

            // Assert: slug kontrolü / Verifying slug format
            expect(result.slug).toMatch(/^great-post-[a-z0-9]+$/);
            expect(prisma.post.create).toHaveBeenCalledTimes(1);
        })
    })

    // ---- updatePost Testleri / Tests for updatePost ----
    describe('updatePost', () => {
        // Ortak değişkenler / Common variables
        const userId = 1;
        const postId = 10;
        const updateDto = {
            title: 'Updated Title',
        }

        it('yazı sahibi güncelleyebilmeli / should allow post owner to update', async () => {
            // ARRANGE: Yazı sahibi olarak updatePost'u çağıracağız, getPostAndValidateAccess içindeki findUnique'u mockluyoruz
            // Mocking findUnique within getPostAndValidateAccess for post owner
            jest.mocked(prisma.post.findUnique).mockResolvedValue({
                id: postId,
                authorId: userId, // Yazı sahibi / Post owner
            } as any);
            // Update işlemi için update methodunu mockluyoruz, güncellenmiş title'ı döndürüyoruz
            // Mocking update method for update operation, returning updated title
            jest.mocked(prisma.post.update).mockResolvedValue({
                id: postId,
                ...updateDto,
            } as any);

            // ACT: updatePost'u yazı sahibi olarak çağırıyoruz
            // Calling updatePost as post owner
            const result = await service.updatePost(userId, Role.USER, postId, updateDto);

            // ASSERT: Güncelleme başarılı ve title güncellenmiş olmalı / Verifying update is successful and title is updated
            expect(result.title).toBe(updateDto.title);
            expect(prisma.post.update).toHaveBeenCalled();
        })

        it('başkasına ait yazıyı güncellemeye çalışınca ForbiddenException fırlatmalı', async () => {
            // ARRANGE: Yazı başkasının (authorId: 99)
            jest.mocked(prisma.post.findUnique).mockResolvedValue({ id: postId, authorId: 99 } as any);

            // ACT & ASSERT
            await expect(service.updatePost(userId, Role.USER, postId, updateDto)).rejects.toThrow(ForbiddenException);
            expect(prisma.post.update).not.toHaveBeenCalled();
        });
    })

    // ---- deletePost Testleri / Tests for deletePost ----
    describe('deletePost', () => {
        const userId = 1;
        const postId = 10;

        it('başkasına ait yazıyı silmeye çalışınca ForbiddenException fırlatmalı / should throw ForbiddenException when trying to delete someone else\'s post', async () => {
            // ARRANGE: Yazı başkasının (authorId: 99) ve biz admin değiliz (Role.USER)
            // Mocking a post that belongs to someone else (authorId: 99) and we are not admin (Role.USER)
            jest.mocked(prisma.post.findUnique).mockResolvedValue({
                id: postId,
                authorId: 99,
            } as any);

            // ACT & ASSERT / Çalıştırma ve Doğrulama
            await expect(service.deletePost(userId, Role.USER, postId)).rejects.toThrow(ForbiddenException);
            expect(prisma.post.update).not.toHaveBeenCalled(); // Silme(update) işlemi yapılmamalı / Delete (update) should not be called
        })

        it('Admin ise başkasının yazısını silebilmeli / should allow admin to delete someone else\'s post', async () => {
            // ARRANGE: Yazı başkasının (authorId: 99) ve biz adminiz (Role.ADMIN)
            // Mocking a post that belongs to someone else (authorId: 99) and we are admin (Role.ADMIN)
            jest.mocked(prisma.post.findUnique).mockResolvedValue({
                id: postId,
                authorId: 99,
                image: 'picture.jpg',
            } as any);
            jest.mocked(prisma.post.update).mockResolvedValue({
                id: postId,
            } as any);

            // ACT: deletePost'u admin olarak çağırıyoruz
            // Calling deletePost as admin
            const result = await service.deletePost(userId, Role.ADMIN, postId);

            // ASSERT: Soft delete yapıldığını doğrula (deletedAt set edilmeli) ve S3'ten silme çağrısı yapılmalı
            // Verifying that soft delete is performed (deletedAt should be set) and delete from S3 is called
            expect(result.message).toBe('Yazı başarıyla silindi. / Post deleted successfully.');
            expect(prisma.post.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    deletedAt: expect.any(Date),
                }),
            }))

            // S3'ten silme çağrıldı mı? / Was delete from S3 called?
            expect(s3Service.deleteFile).toHaveBeenCalledWith('picture.jpg');
        })
    })
})


