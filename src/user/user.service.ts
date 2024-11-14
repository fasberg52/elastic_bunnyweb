import { BadRequestException, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CreateUserDto, GetAllUserDto, UpdateUserDto } from './dto/index.dto';
import { getTotalHits } from '../common/base/total-hit';
import { PaginationService } from '../utils/pagination.service';
import { buildSort } from '../common/base/sort';
import { ListsPaginateResponse } from '../common/response/list.response';
import { UserElasticEntity } from './entity/user.entity';

@Injectable()
export class UserService {
	private user_index = 'user';
	constructor(
		private readonly elasticSearch: ElasticsearchService,
		private readonly paginateService: PaginationService,
	) {}

	async createUser(createUserDto: CreateUserDto) {
		const { id, firstName, lastName, userName, password, role, createdAt, updatedAt } =
			createUserDto;

		const existingUser = await this.elasticSearch.search({
			index: await this.getIndex(),
			body: {
				query: {
					match: {
						userName: userName,
					},
				},
			},
		});
		const totalHits = getTotalHits(existingUser.hits);
		if (totalHits > 0) {
			throw new BadRequestException('این کاربر از قبل وجود دارد');
		}
		const user = {
			id,
			firstName,
			lastName,
			userName,
			password,
			role,
			createdAt,
			updatedAt,
		};

		const response = await this.elasticSearch.index({
			index: await this.getIndex(),
			body: user,
		});

		return {
			_id: response._id,
			...user,
		};
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const { firstName, lastName, userName, password, role } = updateUserDto;

		const user = {
			firstName,
			lastName,
			userName,
			password,
			role,
			updatedAt: new Date(),
		};
		const response = await this.elasticSearch.update({
			index: await this.getIndex(),
			id,
			body: {
				doc: user,
			},
		});

		return {
			_id: response._id,
			...user,
		};
	}

	async deleteUser(id: string) {
		const response = await this.elasticSearch.delete({
			index: await this.getIndex(),
			id,
		});

		return {
			_id: response._id,
		};
	}

	async getAllUsers(
		getAllUserDto: GetAllUserDto,
	): Promise<ListsPaginateResponse<UserElasticEntity>> {
		const { page, limit, query, sortField, sortOrder } = getAllUserDto;
		const { from, size } = await this.paginateService.pagination(page, limit);
		const sort = buildSort(sortField, sortOrder);
		const queries = query ? { match: { query } } : { match_all: {} };
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
				}) as UserElasticEntity,
		);
		const total = getTotalHits(result.hits);

		return this.paginateService.formatPaginatedResponse(data, total, page, limit);
	}

	async createMapping() {
		const index = await this.getIndex();
		const exists = await this.elasticSearch.indices.exists({ index });

		if (!exists) {
			await this.elasticSearch.indices.create({
				index,
				body: {
					mappings: {
						properties: {
							firstName: { type: 'text' },
							lastName: { type: 'text' },
							userName: { type: 'text' },
							password: { type: 'text' },
							role: { type: 'integer' },
							createdAt: { type: 'date' },
							updatedAt: { type: 'date' },
						},
					},
				},
			});
		}
	}

	async getIndex() {
		return process.env.ELASTICSEARCH_INDEX_PREFIX + this.user_index;
	}
}
