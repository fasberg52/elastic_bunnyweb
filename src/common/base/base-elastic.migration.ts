import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class BaseElasticMigration implements OnApplicationBootstrap {
	private readonly logger = new Logger(BaseElasticMigration.name);

	constructor(
		protected readonly configService: ConfigService,
		private readonly elasticsearchService: ElasticsearchService,
		//private readonly createContentElasticMigration: CreateContentElasticMigration,
	) {}

	async onApplicationBootstrap() {
		try {
			await this.elasticsearchService.cat.indices();
			this.logger.log(`elasticsearch CONNECTED`);
		} catch (e) {
			this.logger.error(`elasticsearch DISCONNECTED`);
			return;
		}
		//await this.createContentElasticMigration.run();
	}
}
