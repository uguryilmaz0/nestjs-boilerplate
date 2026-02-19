import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  // ÖNEMLİ: Tipini 'unknown' yapıyoruz çünkü her türlü hata gelebilir / IMPORTANT: We set the type to 'unknown' because any kind of error can come in
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Durum kodunu belirle (exception.getStatus() kullanılmalı!) / Determine the status code (should use exception.getStatus())
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. Mesajı ayıkla
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionRes = exception.getResponse();
      message = typeof exceptionRes === 'object'
        ? (exceptionRes as any).message
        : exceptionRes;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 3. Loglama (Artık 'status' bir number olduğu için >= hatası vermez) / Logging (Since 'status' is now a number, it won't give an error for >=)
    const logMessage = `Error: ${status} | Path: ${request.url} | Message: ${JSON.stringify(message)}`;

    if (status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : 'No stack trace available',
      );
    } else {
      this.logger.warn(logMessage);
    }

    // 4. Yanıt Gönder / Send Response
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      ...(process.env.NODE_ENV !== 'production' && status >= 500
        ? { stack: exception instanceof Error ? exception.stack : null }
        : {}),
    });
  }
}