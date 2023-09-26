import { transaction } from '$lib/db.js';
import { capitalize } from '$lib/helpers.js';
import { pojoData } from '$lib/serverHelpers.js';

export async function load({ url }) {
	let params = {};
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
	let transactions = await transaction.findMany({
		select: {
			borrowable: true,
			user: true,
			comments: true,
			due_at: true,
			issued_at: true,
			returned_at: true,
			id: true
		},
		where: params
	});
	let columns = [
		{ id: 'id', name: 'ID', width: 80 },
		{ id: 'user' },
		{ id: 'book' },
		{ id: 'issued_at' },
		{ id: 'due_at' },
		{ id: 'returned_at' },
		{ id: 'comments' }
	];
	return {
		columns: columns.map(({ id, name, width }) => ({ id, name: name || capitalize(id), width })),
		transactions: transactions.map(
			({ id, borrowable, user, comments, due_at, issued_at, returned_at }) => [
				id,
				`${user.id} ${user.name}`,
				`${borrowable.acc_no} ${borrowable.title}`,
				issued_at.toDateString(),
				due_at.toDateString(),
				returned_at?.toDateString() || 'NA',
				comments
			]
		)
	};
}

export const actions = {
	delete: async function ({ request }) {
		const { _id } = await request.json();
		await Transaction.findOneAndDelete({ _id });
	},
	return: async function ({ request, url }) {
		console.log(request);
		const { id, comments } = await pojoData(request);
		await transaction.update({ where: { id: +id }, data: { returned_at: new Date(), comments } });
	}
};
