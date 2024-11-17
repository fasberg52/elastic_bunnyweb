import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FileService } from '../file-manager/file.service';
import { UserService } from '../user/user.service';

@Injectable()
export class IndexMigrationService implements OnApplicationBootstrap {
	constructor(
		private readonly elasticSearch: ElasticsearchService,
		private readonly fileService: FileService,
		private readonly userService: UserService,
	) {}

	async onApplicationBootstrap() {
		await this.fileService.createMapping();
		await this.userService.createMapping();
	}
}
