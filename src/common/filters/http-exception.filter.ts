import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'; // NestJS çekirdek dekoratörleri / NestJS core decorators
import { Request, Response } from 'express'; // Express tipleri / Express types

// Hata mesajı objesi yapısı / Exception response structure
interface IExceptionResponse {
  statusCode: number;
  message: string | string[]; // Tek mesaj veya dizi (ValidationPipe) / Single or array (ValidationPipe)
  error: string;
}

@Catch(HttpException) // Sadece HttpException türünü yakala / Catch only HttpException types
export class HttpExceptionFilter implements ExceptionFilter {
  // NestJS logger / Built-in NestJS logger
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // host: Mevcut bağlama erişim sağlar / Provides access to the current execution context
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // HTTP bağlamına geç / Switch to HTTP context
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HTTP durum kodu / HTTP status code
    const status = exception.getStatus();

    // Hatanın detaylı içeriği / Detailed exception content
    const exceptionResponse = exception.getResponse();

    // Mesajı tip-güvenli ayıkla / Parse message in a type-safe way
    const message =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as IExceptionResponse).message
        : exceptionResponse;

    // Hata logla / Log the error
    this.logger.error(
      `Error: ${status} | Path: ${request.url} | Message: ${JSON.stringify(message)}`,
    );

    // Standart JSON hata yanıtı / Standardized JSON error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      project: 'NestJS Boilerplate',
    });
  }
}
