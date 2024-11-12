import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { SearchContentDto } from './dto/search.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ContentElasticEntity } from './entity/content.entity';
import { QueryDto } from '../common/dto/query.dto';
import { PaginationService } from '../utils/pagination.service';
import { ListsPaginateResponse } from '../common/response/list.response';

@Injectable()
export class ContentService {
	private readonly content_index = 'content';
	constructor(
		private readonly elasticsearchService: ElasticsearchService,
		private readonly paginationService: PaginationService,
	) {}
	async createContent(createContentDto: CreateContentDto) {
		const { title, content, thumbnail, images, tags, categories } = createContentDto;

		const contents = {
			title,
			content,
			thumbnail,
			images,
			tags,
			categories,
			createdAt: new Date(),
			updatedAt: null,
		};
		const response = await this.elasticsearchService.index({
			index: await this.getIndex(),
			body: contents,
		});

		return {
			_id: response._id,
			...contents,
		};
	}

	async getAllContent(queryDto: QueryDto): Promise<ListsPaginateResponse<ContentElasticEntity>> {
		const { page, limit, query } = queryDto;
		const { from, size } = await this.paginationService.pagination(page, limit);
		const queries = query ? { match: { query } } : { match_all: {} };
		const result = await this.elasticsearchService.search({
			index: await this.getIndex(),
			body: {
				query: queries,
				from,
				size,
				sort: [{ createdAt: { order: 'desc' } }],
			},
		});
		const data = result.hits.hits.map(
			hit =>
				({
					id: hit._id,
					...(hit._source as object),
				}) as ContentElasticEntity,
		);
		const total =
			typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value;
		return this.paginationService.formatPaginatedResponse(data, total, page, limit);
	}

	async searchContent(
		searchContentDto: SearchContentDto,
	): Promise<{ data: ContentElasticEntity[]; total: number }> {
		const { page, limit, query } = searchContentDto;
		const from = (page - 1) * limit;
		const size = limit;
		const result = await this.elasticsearchService.search({
			index: await this.getIndex(),
			body: {
				query: {
					multi_match: {
						query: query,
						fields: ['title', 'content', 'tags'],
					},
				},
				from,
				size,
			},
		});

		const data = result.hits.hits.map(hit => hit._source as ContentElasticEntity);
		const total =
			typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value;

		return { data, total };
	}

	async getIndex() {
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.content_index;
	}
}
