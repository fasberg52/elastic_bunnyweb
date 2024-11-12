import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CreateContentDto } from './dto/create-content.dto';
import { SearchContentDto } from './dto/search.dto';

export class ContentRepository {
	private readonly content_index = 'content';
	constructor(
		protected readonly configService: ConfigService,
		protected readonly elasticsearchService: ElasticsearchService,
	) {}

	async createMapping() {
		const index = await this.getIndex();

		try {
			const response = await this.elasticsearchService.indices.create({
				index,
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

			console.log('Index created:', response);
		} catch (error) {
			console.error('Error creating index:', error);
		}
	}



	async createContent(createContentDto: CreateContentDto) {
		try {
			console.log(`${JSON.stringify(createContentDto)}`);
			const test = await this.elasticsearchService.index({
				index: await this.getIndex(),
				body: createContentDto,
			});
			console.log('Content created:', test);
			return;
		} catch (error) {
			console.error('Error creating content >>>> :', error);
		}
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
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.content_index;
	}
}
