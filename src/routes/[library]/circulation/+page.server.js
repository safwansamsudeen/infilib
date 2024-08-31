import { transaction } from '$lib/db';
import { pojoData, response } from '$lib/helpers';
import { getTransColumns } from '$lib/columns';
import dayjs from 'dayjs';

export async function load({ url, params }) {
	let where = {
		deleted: { not: true },
		item: { is: { library_slug: params.library } },
		issued_at: { gte: dayjs().subtract(1, 'month') }
	};
	for (let [key, val] of url.searchParams.entries()) {
		if (key === 'due') {
			if (val === 'today') {
				where.due_at = { lte: new Date() };
				where.returned_at = { equals: null };
			} else where['due_at'] = { lte: new Date(), gte: new Date(val) };
		} else if (key === 'since') {
			where['issued_at'].gte = new Date(val);
		} else if (key === 'until') {
			where['issued_at'].lte = new Date(val);
		}
	}

	return {
		columns: getTransColumns(params.library),
		transactions: transaction.findMany({
			include: {
				item: true,
				user: true,
				subscription: { include: { type: true } }
			},
			where
		})
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
