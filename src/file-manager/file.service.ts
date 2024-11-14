import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { S3Service } from '../utils/s3.service';
import { ConfigService } from '@nestjs/config';
import { FileElasticEntity } from './entity/file.entity';

@Injectable()
export class FileService {
	private readonly file_index = 'file';
	private s3Client: S3Client;
	private endpoint: string;

	constructor(
		private readonly elasticSearch: ElasticsearchService,
		private readonly s3Service: S3Service,
		private readonly configService: ConfigService,
	) {}

	async uploadFile(file: Express.Multer.File): Promise<any> {
		const key = uuidv4();

		const s3Response = await this.s3Service.uploadFile(file, {
			Key: key,
			ContentType: file.mimetype,
		});

		const data = {
			key,
			size: file.size,
			url: s3Response.url,
			mimetype: file.mimetype,
		};

		const response = await this.elasticSearch.index({
			index: await this.getIndex(),
			body: data,
		});

		return {
			id: response._id,
			...data,
		};
	}

	async getFileUrl(key: string): Promise<FileElasticEntity> {
		const existingFile = await this.elasticSearch.search({
			index: await this.getIndex(),
			body: {
				query: {
					bool: {
						must: [
							{
								term: {
									key: key,
								},
							},
						],
					},
				},
			},
		});

		if (
			(typeof existingFile.hits.total === 'number' && existingFile.hits.total === 0) ||
			(typeof existingFile.hits.total !== 'number' && existingFile.hits.total.value === 0)
		) {
			throw new NotFoundException('فایل وجود ندارد');
		}

		const result = await this.s3Service.getFileUrl(key);

		return result;
	}

	async getIndex() {
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.file_index;
	}
}
