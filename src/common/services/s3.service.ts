import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private readonly bucketName;
    private readonly region;
    private readonly endpoint;

    constructor(private configService: ConfigService) {
        // Ortam değişkenlerinden S3 bilgilerini al / Get S3 config from environment
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
        this.region = this.configService.get<string>('AWS_S3_REGION')!;
        this.endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');

        this.s3Client = new S3Client({
            region: this.region,
            // Özel endpoint varsa kullan (MinIO/Supabase), yoksa AWS / Use custom endpoint if set, otherwise AWS
            endpoint: this.endpoint,
            forcePathStyle: true, // S3 uyumlu sağlayıcılar için gerekli / Required for S3-compatible providers
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!, // Access key from environment 
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')! // Secret key from environment
            }
        });
    }

    // S3'e dosya yükle / Upload a file to S3
    async uploadFile(file: Express.Multer.File): Promise<string> {
        // Benzersiz dosya adı / Unique file name
        const key = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }))

        // Özel endpoint varsa URL'yi buna göre oluştur / Build URL based on custom endpoint
        const baseUrl = this.endpoint ?
            `${this.endpoint}/${this.bucketName}` :
            `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;

        return `${baseUrl}/${key}`;
    }

    // URL ile S3'ten dosya sil / Delete a file from S3 by its URL
    async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return; // URL yoksa işlem yapma / Skip if no URL
        const key = fileUrl.split('/').pop(); // URL'nin son segmenti dosya adı / Last URL segment is the file key
        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        }))
    }
}