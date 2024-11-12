import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PaginationService } from '../utils/pagination.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/index.dto';

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

	async getIndex() {
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.project_index;
	}
}
