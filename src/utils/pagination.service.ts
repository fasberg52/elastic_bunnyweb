import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
	async pagination(page: number, limit: number) {
		const from = (page - 1) * limit;
		return { from, size: limit };
	}

	formatPaginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			success: true,
		};
	}
}
