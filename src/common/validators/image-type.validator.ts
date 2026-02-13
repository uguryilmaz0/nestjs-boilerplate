import { FileValidator } from '@nestjs/common';

export class ImageValidator extends FileValidator {
    constructor() {
        // Üst sınıfa boş ayar nesnesi gönder / Pass empty config to parent class
        super({});
    }

    /**
     * Doğrulama mantığı: MIME tipini kontrol eder
     * Validation logic: checks MIME type from Multer
     */
    isValid(file: Express.Multer.File): boolean {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        // İzin verilen tipler listesinde mi? / Is it in the allowed types list?
        return allowedMimeTypes.includes(file.mimetype);
    }

    /**
     * Doğrulama başarısız olduğunda dönen hata mesajı
     * Error message returned when validation fails
     */
    buildErrorMessage(): string {
        return 'Yalnızca resim dosyaları yüklenebilir. / Only image files (jpg, jpeg, png, gif) are allowed.';
    }
}