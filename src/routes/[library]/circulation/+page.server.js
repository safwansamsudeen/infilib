import { item, transaction } from '$lib/db.js';
import { prettify } from '$lib/helpers.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { getTransColumns } from '$lib/columns.js';

export async function load({ url, params }) {
	let where = { deleted: { not: true }, item: { is: { library_slug: params.library } } };
	for (let [key, val] of url.searchParams.entries()) {
		if (key === 'due') {
			if (val === 'today') {
				where.due_at = { lte: new Date() };
				where.returned_at = { equals: null };
			} else where['due_at'] = { lte: new Date(), gte: new Date(val) };
		} else if (val) {
			where[key] = val;
		}
	}

	return {
		streamed: {
			transactions: (async () => {
				const columns = await getTransColumns(params.library);
				const transactions = await transaction.findMany({
					include: {
						item: true,
						user: true,
						subscription: true
					},
					where
				});
				prettify(transactions, columns);

				return { transactions, columns };
			})()
		}
	};
}

export const actions = {
	delete: async function ({ request }) {
		const { id } = await pojoData(request);
		await transaction.update({
			where: { id: +id },
			data: { deleted: true, item: { update: { status: 'IN' } } }
		});
	},
	return: async function ({ request }) {
		return await response(async () => {
			const { id } = await pojoData(request);
			await transaction.update({
				where: { id: +id },
				data: { returned_at: new Date(), item: { update: { status: 'IN' } } }
			});
		});
	}
};
