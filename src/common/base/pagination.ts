export class Pagination {
	page: number;
	limit: number;
	total: number;

	constructor(page: number, limit: number, total: number) {
		this.page = page;
		this.limit = limit;
		this.total = total;
	}
}
