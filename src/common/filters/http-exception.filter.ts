import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'; // NestJS çekirdek dekoratörleri ve arayüzleri
import { Request, Response } from 'express'; // Alttaki Express kütüphanesinin tipleri

// Hata mesajı objesinin yapısını tanımlıyoruz
interface IExceptionResponse {
  statusCode: number;
  message: string | string[]; // Hata tek bir string veya dizi (ValidationPipe'dan gelenler gibi) olabilir
  error: string;
}

@Catch(HttpException) // Sadece HttpException türündeki hataları yakalamasını söylüyoruz
export class HttpExceptionFilter implements ExceptionFilter {
  // NestJS logger'ını sınıf isimleriyle birlikte tanımlıyoruz
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // host: ArgumentsHost -> İsteğin o anki bağlamına (context) erişmemizi sağlar (Request, Response vb.)
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Bağlamı HTTP protokolüne çeviriyoruz
    const response = ctx.getResponse<Response>(); // Express Response nesnesini alıyoruz
    const request = ctx.getRequest<Request>(); // Express Request nesnesini alıyoruz

    // Hata kodunu (400, 404, 500 vb.) alıyoruz
    const status = exception.getStatus();

    // Hatanın detaylı içeriğini alıyoruz
    const exceptionResponse = exception.getResponse();

    // Hata mesajını dinamik ama tip güvenli şekilde ayrıştırıyoruz
    const message =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as IExceptionResponse).message
        : exceptionResponse;

    // Hata detaylarını logluyoruz
    this.logger.error(
      `Hata: ${status} | Path: ${request.url} | Mesaj: ${JSON.stringify(message)}`,
    );

    // Kullanıcıya (React tarafına) dönecek standart JSON şeması
    response.status(status).json({
      statusCode: status, // HTTP durum kodu
      timestamp: new Date().toISOString(), // Hatanın oluştuğu an (ISO formatında)
      path: request.url, // Hangi URL'de hata oluştu?
      message: message, // Temizlenmiş hata mesajı
      project: 'NestJS Boilerplate', // Proje tanımlayıcısı
    });
  }
}
