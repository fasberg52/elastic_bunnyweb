import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { FileService } from '../file-manager/file.service';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class IndexMigrationService implements OnApplicationBootstrap {
	constructor(
		private readonly elasticSearch: ElasticsearchService,
		private readonly fileService: FileService,
		private readonly userService: UserService,
		private readonly projectService: ProjectService,
	) {}

	async onApplicationBootstrap() {
		await this.fileService.createMapping();
		await this.userService.createMapping();
		await this.projectService.createMapping();
	}
}
