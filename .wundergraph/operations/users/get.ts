import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.query({
	input: z.object({
		id: z.string(),
	}),
	handler: async ({ input, operations }) => {
		const occ_getAllPages = await operations.query({
			operationName: 'occ/queries/occ_getAllPages',
			input: {
				baseSiteId: 'electronics',
				currentPage: 1,
				pageSize: 10,
				fields: 'DEFAULT',
				pageType: 'ContentPage'
			}
		});
		const countries = await operations.query({
			operationName: 'countries/queries/countries_continent',
			input: {
				code: 'EU'
			}
		});
		const occ_getCatalogs = await operations.query({
			operationName: 'occ/queries/occ_getCatalogs',
			input: {
				baseSiteId: 'electronics',
				fields: 'DEFAULT'
			}
		});

		return {
			id: input.id,
			name: 'Jens',
			bio: 'Founder of WunderGraph',
			countries,
			occ: {
				pages: occ_getAllPages,
				catalogs: occ_getCatalogs,
			}
		};
	},
});
