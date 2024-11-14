export const buildSort = (sortField: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') => {
	return [{ [sortField]: { order: sortOrder } }];
};
