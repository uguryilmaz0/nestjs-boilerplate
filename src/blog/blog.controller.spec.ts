import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Role } from '@prisma/client';

describe('BlogController', () => {
    let controller: BlogController;
    let service: BlogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BlogController],
            providers: [
                {
                    provide: BlogService,
                    useValue: {
                        // Servis metodlarını mock'lıyoruz / Mocking service methods
                        getPosts: jest.fn(),
                        getPostById: jest.fn(),
                        createPost: jest.fn(),
                        updatePost: jest.fn(),
                        deletePost: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<BlogController>(BlogController);
        service = module.get<BlogService>(BlogService);
    });

    it('controls must be defined', () => {
        expect(controller).toBeDefined();
    });

    // ---- getPosts (Yazıları Listeleme) ----
    describe('getPosts', () => {
        it('query parametrelerini servise doğru iletmeli / should pass query params to service', async () => {
            const query = { page: 2, limit: 5, search: 'nestjs' };
            const mockResult = {
                data: [], meta: {
                    totalItems: 0,
                    page: 2,
                    limit: 5,
                    totalPages: 0,
                }
            };
            // ARRANGE: Servis metodunun ne döneceğini ayarlıyoruz
            // Setting up what the service method should return
            jest.spyOn(service, 'getPosts').mockResolvedValue(mockResult);

            // ACT: Controller'ın getPosts metodunu çağırıyoruz
            // Calling the controller's getPosts method
            const result = await controller.getAllPosts(query);

            // ASSERT: Servis metodunun doğru parametrelerle çağrıldığını ve sonucu döndürdüğünü kontrol ediyoruz
            // Verifying the service method is called with correct parameters and returns the result
            expect(service.getPosts).toHaveBeenCalledWith(query);
            expect(result).toEqual(mockResult);

        })
    })

    // ---- createPost (Yazı Oluşturma) ----
    describe('createPost', () => {
        it('kullanıcı ID ve DTO bilgilerini servise iletmeli / should pass userId and DTO to service', async () => {
            const userId = 1;
            const dto = { title: 'Yeni Yazı', content: 'İçerik...', tags: ['tech'] };
            const mockCreatedPost = { id: 101, ...dto, authorId: userId };

            // ARRANGE
            // Servis metodunun ne döneceğini ayarlıyoruz / Setting up what the service method should return
            jest.spyOn(service, 'createPost').mockResolvedValue(mockCreatedPost as any);

            // ACT - Controller'ın createPost metodunu çağırıyoruz, userId'yi manuel geçiyoruz
            // Calling the controller's createPost method, passing userId manually
            // Not: Normalde userId @GetUser() dekoratöründen gelir, testte manuel geçiyoruz
            // Note: Normally userId comes from @GetUser() decorator, we pass it manually
            const result = await controller.createNewPost(userId, dto);

            // ASSERT - Servis metodunun doğru parametrelerle çağrıldığını ve sonucu döndürdüğünü kontrol ediyoruz
            // Verifying the service method is called with correct parameters and returns the result
            expect(service.createPost).toHaveBeenCalledWith(userId, dto);
            expect(result).toEqual(mockCreatedPost);

        });
    });

    // ---- deletePost (Yazı Silme - Yetki Kontrollü) ----
    describe('deletePost', () => {
        it('silme parametrelerini servise doğru iletmeli / should pass delete params to service', async () => {
            const userId = 1;
            const role = Role.ADMIN;
            const postId = 10;
            const mockResponse = { message: 'Yazı silindi / Post deleted' };

            // ARRANGE - Servis metodunun ne döneceğini ayarlıyoruz / Setting up what the service method should return
            jest.spyOn(service, 'deletePost').mockResolvedValue(mockResponse);

            // ACT - Controller'ın deletePost metodunu çağırıyoruz, userId ve role'ü manuel geçiyoruz
            // Calling the controller's deletePost method, passing userId and role manually
            const result = await controller.deleteExistingPost(userId, role, postId);

            // ASSERT - Servis metodunun doğru parametrelerle çağrıldığını ve sonucu döndürdüğünü kontrol ediyoruz
            // Verifying the service method is called with correct parameters and returns the result
            expect(service.deletePost).toHaveBeenCalledWith(userId, role, postId);
            expect(result).toEqual(mockResponse);
        })
    });
});