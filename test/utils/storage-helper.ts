import { CreateBucketCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Testler için gerekli olan S3/MinIO kovasının (bucket) varlığını kontrol eder, yoksa oluşturur.
 * Ensures the S3/MinIO bucket exists for tests, creates it if it doesn't.
 */
export async function ensureBucketExists(app: INestApplication) {
    const configService = app.get(ConfigService);

    // Test the MinIO/S3 connection and prepare the bucket if it doesn't exist
    const s3Client = new S3Client({
        endpoint: configService.get<string>('AWS_S3_ENDPOINT')!,
        region: configService.get<string>('AWS_S3_REGION')!,
        credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID')!,
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
        },
        forcePathStyle: true,
    });

    const bucketName = configService.get<string>('AWS_S3_BUCKET_NAME')!;

    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (error) {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`--- Test bucket "${bucketName}" created! ---`);
    }
}