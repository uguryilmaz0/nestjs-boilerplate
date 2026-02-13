import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
            // Özel endpoint varsa kullan (MinIO/Supabase), yoksa AWS / Use custom endpoint if set, otherwise AWS
            endpoint: process.env.AWS_S3_ENDPOINT || undefined,
            forcePathStyle: true, // S3 uyumlu sağlayıcılar için gerekli / Required for S3-compatible providers
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '-',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '-',
            }
        })
    }

    // S3'e dosya yükle / Upload a file to S3
    async uploadFile(file: Express.Multer.File): Promise<string> {
        // Benzersiz dosya adı / Unique file name
        const key = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;

        await this.s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }))

        // Özel endpoint varsa URL'yi buna göre oluştur / Build URL based on custom endpoint
        const baseUrl = process.env.AWS_S3_ENDPOINT ?
            `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET_NAME}` :
            `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`;

        return `${baseUrl}/${key}`;
    }

    // URL ile S3'ten dosya sil / Delete a file from S3 by its URL
    async deleteFile(fileUrl: string): Promise<void> {
        if (!fileUrl) return; // URL yoksa işlem yapma / Skip if no URL
        const key = fileUrl.split('/').pop(); // URL'nin son segmenti dosya adı / Last URL segment is the file key
        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        }))
    }
}