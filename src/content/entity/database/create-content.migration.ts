// import { Injectable, Logger } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { ContentRepository } from '../../content.repository';
// @Injectable()
// export class CreateContentElasticMigration {
// 	private readonly logger = new Logger(CreateContentElasticMigration.name);
// 	constructor(
// 		private readonly elasticsearchService: ElasticsearchService,
// 		private readonly contentRepository: ContentRepository,
// 	) {}

// 	async run() {
// 		if (
// 			await this.elasticsearchService.indices.exists({
// 				index: await this.contentRepository.getIndex(),
// 			})
// 		) {
// 			return;
// 		}
// 		await this.contentRepository.createMapping();
// 		this.logger.log(`${this.constructor.name} initialized`);
// 	}
// }
