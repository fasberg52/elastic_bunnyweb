import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index.dto';
import { CategoryElasticEntity } from './entity/category.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetAllCategoryDto } from './dto/get-all-category.dto';
import { ListsPaginateResponse } from '../common/response/list.response';
import { PaginationService } from '../utils/pagination.service';
import { buildSort } from '../common/base/sort';
import { getTotalHits } from '../common/base/total-hit';

@Injectable()
export class CategoriesService {
	private readonly category_index = 'category';
	constructor(
		private readonly elasticSearch: ElasticsearchService,
		private readonly paginationService: PaginationService,
	) {}

	async findOne(id: string): Promise<CategoryElasticEntity> {
		const response = await this.elasticSearch.get({
			index: await this.getIndex(),
			id,
		});

		if (!response) {
			throw new NotFoundException(`دسته بندی با شناسه ${id} یافت نشد`);
		}

		return {
			id: response._id,
			...(response._source as CategoryElasticEntity),
		};
	}

	async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryElasticEntity> {
		const { name, description, image, slug, parentId, status, level, type } = createCategoryDto;

		const category = {
			name,
			description,
			image,
			slug,
			parentId,
			status,
			level,
			type,
			createdAt: new Date(),
			updatedAt: null,
		};

		const response = await this.elasticSearch.index({
			index: await this.getIndex(),
			body: category,
		});

		return {
			id: response._id,
			...category,
		};
	}

	async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryElasticEntity> {
		const { name, description, image, level, parentId, slug, status, type } = updateCategoryDto;

		const exitingCategory = await this.elasticSearch.get({
			index: await this.getIndex(),
			id,
		});

		if (!exitingCategory) {
			throw new NotFoundException(`دسته بندی با شناسه ${id} یافت نشد`);
		}

		const updateCategory = {
			id,
			name,
			description,
			image,
			level,
			parentId,
			slug,
			status,
			type,
			updatedAt: new Date(),
		};

		const response = await this.elasticSearch.update({
			index: await this.getIndex(),
			id,
			body: {
				doc: updateCategory,
			},
		});

		return {
			id: response._id,
			...updateCategory,
		};
	}

	async getAllCategories(
		queryDto: GetAllCategoryDto,
	): Promise<ListsPaginateResponse<CategoryElasticEntity>> {
		const { page, limit, query, status, parentId, dateRange, sortField, sortOrder } = queryDto;
		const { from, size } = await this.paginationService.pagination(page, limit);

		const mustQueries = [];
		if (query) {
			mustQueries.push({ match: { query } });
		} else {
			mustQueries.push({ match_all: {} });
		}

		if (status) {
			mustQueries.push({ term: { status } });
		}

		if (parentId) {
			mustQueries.push({ term: { parentId } });
		}

		if (dateRange) {
			const { start, end } = dateRange;
			if (start || end) {
				mustQueries.push({
					range: {
						createdAt: {
							gte: start,
							lte: end,
						},
					},
				});
			}
		}

		const sort = buildSort(sortField, sortOrder);

		const queries = { bool: { must: mustQueries } };

		const result = await this.elasticSearch.search({
			index: await this.getIndex(),
			body: {
				query: queries,
				from,
				size,
				sort,
			},
		});

		const data = result.hits.hits.map(
			hit =>
				({
					id: hit._id,
					...(hit._source as object),
				}) as CategoryElasticEntity,
		);

		const total = getTotalHits(result.hits);

		return this.paginationService.formatPaginatedResponse(data, total, page, limit);
	}

	async deleteCategory(id: string) {
		return this.elasticSearch.delete({
			index: await this.getIndex(),
			id,
		});
	}

	async getIndex() {
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.category_index;
	}
}
