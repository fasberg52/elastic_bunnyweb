import { Pagination } from '../../common/base/pagination';

export class ListResponse<T> {
	data: T;

	success: boolean;
	constructor(data: T) {
		this.success = true;
		this.data = data;
	}
}

export class ListsResponse<T> {
	data: T[];
	total: number;
	success: boolean;
	constructor(data: T[], total: number) {
		this.success = true;
		this.data = data;
		this.total = total;
	}
}

export class ListsPaginateResponse<T> extends Pagination {
	success: boolean;
	data: T[];

	constructor(data: T[], total: number, page: number, limit: number) {
		super(Number(page), Number(limit), total);
		this.success = true;
		this.data = data;
	}
}
