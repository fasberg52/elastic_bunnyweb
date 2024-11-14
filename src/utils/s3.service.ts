import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { FileElasticEntity } from 'file-manager/entity/file.entity';
import { v4 as uuidv4 } from 'uuid';

export class S3Service {
	private s3Client: S3Client;
	private bucketName: string;
	private endpoint: string;

	constructor(private readonly configService: ConfigService) {
		this.s3Client = new S3Client({
			endpoint: process.env.LIARA_BUCKET_ENDPOINT,
			region: process.env.LIARA_REGION,
			credentials: {
				accessKeyId: process.env.LIARA_BUCKET_ACCESS_KEY,
				secretAccessKey: process.env.LIARA_BUCKET_SECRET_KEY,
			},
		});
		this.bucketName = process.env.LIARA_BUCKET_NAME;
		this.endpoint = process.env.LIARA_BUCKET_ENDPOINT;
	}

	async getFileUrl(key: string): Promise<FileElasticEntity> {
		try {
			const command = new GetObjectCommand({
				Key: key,
				Bucket: this.bucketName,
			});

			const url = `${this.endpoint}/${this.bucketName}/${key}`;
			return { url } as FileElasticEntity;
		} catch (error) {
			throw new Error(`Failed to get file url: ${error.message}`);
		}
	}

	async uploadFile(file: Express.Multer.File, params): Promise<{ key: string; url: string }> {
		const key = params.Key || uuidv4();

		try {
			const command = new PutObjectCommand({
				...params,
				Key: key,
				Bucket: this.bucketName,
				Body: file.buffer,
				ContentType: file.mimetype,
			});

			await this.s3Client.send(command);

			const url = `${this.endpoint}/${this.bucketName}/${key}`;
			return { key, url };
		} catch (error) {
			throw new Error(`Failed to upload file: ${error.message}`);
		}
	}
}
