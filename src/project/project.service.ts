import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PaginationService } from '../utils/pagination.service';
import { CreateProjectDto, UpdateProjectDto, GetAllProjectDto } from './dto/index.dto';
import { ProjectElasticEntity } from './entity/project.entity';
import { ListsPaginateResponse } from '../common/response/list.response';
import { buildSort } from '../common/base/sort';

@Injectable()
export class ProjectService {
	private readonly project_index = 'project';
	constructor(
		private readonly elasticsearchService: ElasticsearchService,
		private readonly paginationService: PaginationService,
	) {}

	async createProject(createProjectDto: CreateProjectDto) {
		const { title, description, thumbnail, images, tags, categories } = createProjectDto;

		const projects = {
			title,
			description,
			thumbnail,
			images,
			tags,
			categories,
			createdAt: new Date(),
			updatedAt: null,
		};
		const response = await this.elasticsearchService.index({
			index: await this.getIndex(),
			body: projects,
		});

		return {
			_id: response._id,
			...projects,
		};
	}

	async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
		const { title, description, thumbnail, images, tags, categories } = updateProjectDto;

		const projects = {
			title,
			description,
			thumbnail,
			images,
			tags,
			categories,
			updatedAt: new Date(),
		};
		const response = await this.elasticsearchService.update({
			index: await this.getIndex(),
			id,
			body: {
				doc: projects,
			},
		});

		return {
			_id: response._id,
			...projects,
		};
	}

	async getAllProject(
		queryDto: GetAllProjectDto,
	): Promise<ListsPaginateResponse<ProjectElasticEntity>> {
		const { page, limit, query, status, category, dateRange, sortField, sortOrder } = queryDto;
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

		if (category) {
			mustQueries.push({ term: { categories: category } });
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

		const result = await this.elasticsearchService.search({
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
				}) as ProjectElasticEntity,
		);
		const total =
			typeof result.hits.total === 'number' ? result.hits.total : result.hits.total.value;
		return this.paginationService.formatPaginatedResponse(data, total, page, limit);
	}

	async deleteProject(id: string) {
		return this.elasticsearchService.delete({
			index: await this.getIndex(),
			id,
		});
	}
	

	async getIndex() {
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.project_index;
	}
}
