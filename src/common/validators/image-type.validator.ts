import { FileValidator } from '@nestjs/common';

export class ImageValidator extends FileValidator {
    constructor() {
        // Üst sınıfa (FileValidator) boş bir ayar nesnesi gönderiyoruz.
        super({});
    }

    /**
   * 🔍 Doğrulama Mantığı
   * Regex karmaşasına girmeden, Multer'dan gelen MIME tipini kontrol ediyoruz.
   */

    isValid(file: Express.Multer.File): boolean {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        // Gelen dosyanın tipi listemizde varsa 'true' döner, yoksa 400 hatası fırlatılır.
        return allowedMimeTypes.includes(file.mimetype);
    }

    /**
   * ❌ Hata Mesajı
   * Doğrulama başarısız olduğunda kullanıcıya dönecek mesaj.
   */

    buildErrorMessage(): string {
        return 'Yalnızca resim dosyaları (jpg, jpeg, png, gif) yüklenebilir.';
    }
}