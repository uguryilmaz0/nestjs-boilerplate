import { Injectable, NestInterceptor, Logger, CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

/**
 * Tüm HTTP isteklerini izleyen ve loglayan Interceptor
 * Interceptor that monitors and logs all HTTP requests
 */

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    // 'HTTP' bağlamı (context) ile logger'ı başlatıyoruz / We initialize the logger with the 'HTTP' context
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const now = Date.now(); // İstek zamanını ISO formatında alıyoruz / We get the request time in ISO format

        return next.handle().pipe(
            // RxJS tap operatörünü kullanarak yan etkiler ekliyoruz / We use the RxJS tap operator to add side effects
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode; // Yanıt durum kodunu alıyoruz / We get the response status code
                const delay = Date.now() - now; // İstek süresini hesaplıyoruz / We calculate the request duration

                this.logger.log(
                    `[${method}] ${url} - ${statusCode} - ${delay}ms - IP: ${ip}` // Log formatı: [METHOD] URL - STATUS_CODE - DURATIONms - IP: CLIENT_IP
                )
            })
        )


    }

}