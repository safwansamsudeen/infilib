import { item, transaction } from '$lib/db.js';
import { standardizeSelects } from '$lib/helpers.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { getTransColumns } from '$lib/columns.js';

export async function load({ url }) {
	let params = { deleted: { not: true } };
	for (let [key, val] of url.searchParams.entries()) {
		if (key === 'due') {
			if (val === 'today') {
				params.due_at = { lte: new Date() };
				params.returned_at = { equals: null };
			} else params['due_at'] = { lte: new Date(), gte: new Date(val) };
		} else if (val) {
			params[key] = val;
		}
	}
	const transColumns = await getTransColumns();

	return {
		columns: transColumns,
		transactions: {
			data: new Promise(async (fulfil) => {
				const transactions = await transaction.findMany({
					include: {
						item: true,
						user: true
					},
					where: params
				});
				standardizeSelects(transactions, transColumns);
				fulfil(transactions);
			})
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
			const { id, comments } = await pojoData(request);
			await transaction.update({
				where: { id: +id },
				data: { returned_at: new Date(), comments, item: { update: { status: 'IN' } } }
			});
		});
	}
};
