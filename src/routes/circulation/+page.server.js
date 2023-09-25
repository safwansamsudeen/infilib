import { transaction } from '$lib/db.js';
import { capitalize } from '$lib/helpers.js';
import { pojoData } from '$lib/serverHelpers.js';

export async function load({ url }) {
	let params = {};
	for (let [key, val] of url.searchParams.entries()) {
		if (key === 'due') {
			if (val === 'today') {
				params.due_at = { lte: new Date() };
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
			returned_at: true
		},
		where: params
	});
	let columns = [
		{ id: 'user' },
		{ id: 'book' },
		{ id: 'issued_at' },
		{ id: 'due_at' },
		{ id: 'returned_at' },
		{ id: 'comments' }
	];
	return {
		columns: columns.map(({ id }) => ({ id, name: capitalize(id) })),
		transactions: transactions.map(
			({ borrowable, user, comments, due_at, issued_at, returned_at }) => [
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
	return: async function ({ request }) {
		const { _id, comments } = await pojoData(request);
		await Transaction.findOneAndUpdate({ _id }, { returned: new Date(), comments });
	}
};
