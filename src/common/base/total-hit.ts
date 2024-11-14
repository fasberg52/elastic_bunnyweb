export const getTotalHits = (hits: any): number => {
	return typeof hits.total === 'number' ? hits.total : hits.total.value;
};
