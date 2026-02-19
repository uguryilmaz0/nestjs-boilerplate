import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { Environment } from '../enums/environment.enum';

// Logger yapılandırması / Logger configuration
export const getLoggerConfig = (nodeEnv: string) => {
    const isProduction = nodeEnv === Environment.PRODUCTION;

    return {
        handleExceptions: true, // Unhandled exception'ları yakala / Handle unhandled exceptions
        handleRejections: true, // Unhandled promise rejection'ları yakala / Handle unhandled promise rejections
        transports: [
            // 1. Konsol Logları (Geliştirme sırasında renkli ve okunaklı) / Console Logs (Colorful and readable during development)
            new winston.transports.Console({
                level: isProduction ? 'info' : 'debug', // Üretimde sadece info ve üzeri, geliştirmede debug ve üzeri logları göster / Show only info and above in production, debug and above in development
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    nestWinstonModuleUtilities.format.nestLike('MyApp', { colors: true, prettyPrint: true })
                )
            }),

            // 2. Hata Logları (Sadece hataları 'logs/error-%DATE%.log' içine yazar) / Error Logs (Only writes errors to 'logs/error-%DATE%.log')
            new winston.transports.DailyRotateFile({
                level: 'error', // Sadece error seviyesindeki logları kaydet / Only log messages with 'error' level and above
                filename: 'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true, // Eski logları sıkıştır / Compress old logs
                maxSize: '20m', // Her log dosyasının maksimum boyutu / Maximum size for each log file
                maxFiles: '14d', // 14 gün sonra eski logları sil / Delete old logs after 14 days
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
            }),

            // 3. Tüm Loglar (INFO, WARN, ERROR her şeyi 'logs/combined-%DATE%.log' içine yazar) / All Logs (Writes everything including INFO, WARN, ERROR to 'logs/combined-%DATE%.log')
            new winston.transports.DailyRotateFile({
                filename: 'logs/combined-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true, // Eski logları sıkıştır / Compress old logs
                maxSize: '20m', // Her log dosyasının maksimum boyutu / Maximum size for each log file
                maxFiles: '30d', // 30 gün sonra eski logları sil / Delete old logs after 30 days
                format: winston.format.combine(
                    winston.format.timestamp(),
                    isProduction ? winston.format.json() : winston.format.simple() // Üretimde JSON, geliştirmede basit format / JSON in production, simple format in development
                )
            })
        ]
    }
}