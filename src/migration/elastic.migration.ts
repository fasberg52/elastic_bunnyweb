import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FileService } from '../file-manager/file.service';

@Injectable()
export class IndexMigrationService implements OnApplicationBootstrap {
	constructor(
		private readonly elasticSearch: ElasticsearchService,
		private readonly fileService: FileService,
	) {}

	async onApplicationBootstrap() {
		await this.fileService.createMapping();
	}
}
