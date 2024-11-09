import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CreateContentDto } from './dto/create-content.dto';
import { SearchContentDto } from './dto/search.dto';

export class ContentRepository implements OnModuleInit {
	constructor(
		private readonly configService: ConfigService,
		protected readonly elasticsearchService: ElasticsearchService,
	) {}

	async onModuleInit() {
		await this.createMapping();
	}

	async createMapping() {
		await this.elasticsearchService.indices.create({
			index: await this.getIndex(),
			body: {
				mappings: {
					properties: {
						title: { type: 'text' },
						content: { type: 'text' },
						thumbnail: { type: 'text' },
						images: {
							type: 'nested',
							properties: { url: { type: 'text' }, alt: { type: 'text' } },
						},
						tags: { type: 'keyword' },
						category: { type: 'keyword' },
						createdAt: { type: 'date' },
						updatedAt: { type: 'date' },
					},
				},
			},
		});
	}

	async createContent(createContentDto: CreateContentDto) {
		return this.elasticsearchService.index({
			index: await this.getIndex(),
			body: createContentDto,
		});
	}

	async searchContent(searchContentDto: SearchContentDto) {
		return this.elasticsearchService.search({
			index: await this.getIndex(),
			body: {
				query: {
					multi_match: {
						query: searchContentDto.query,
						fields: ['title', 'content', 'tags'],
					},
				},
			},
		});
	}

	async getIndex() {
		return this.configService.get('ELASTICSEARCH_INDEX');
	}
}
