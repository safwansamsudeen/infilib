import { transaction, user } from '$lib/db.js';
import { date } from '$lib/helpers.js';
import { parseData, pojoData, response } from '$lib/serverHelpers.js';
import { parseProperties, validateUserProperty } from '$lib/validators.js';
import { fail, redirect } from '@sveltejs/kit';
import { transColumns, getUserColumns } from '$lib/columns.js';

export async function load({ params }) {
	let user_obj = await user.findUnique({
		where: { id: +params.id }
	});

	const transactions = await transaction.findMany({
		where: { user_id: +params.id },
		include: { item: true }
	});

	return {
		user: user_obj,
		transactions: transactions.map(({ id, item, issued_at, due_at, returned_at, comments }) => ({
			id,
			item: `${item.acc_no} ${item.title}`,
			issued_at: date(issued_at),
			due_at: date(due_at),
			returned_at: date(returned_at) || 'NA',
			comments
		})),
		columns: getUserColumns(),
		transColumns: transColumns(false)
	};
}

export const actions = {
	update: async ({ request }) => {
		const data = await pojoData(request);
		let check = parseProperties(data, await getUserColumns());
		if (check) return new fail(400, check);
		try {
			await user.update({
				where: { id: data.id },
				data
			});
		} catch (error) {
			return fail(400, { error: error.message });
		}
	},
	delete: async ({ request, params }) => {
		const { confirmed } = await pojoData(request);
		try {
			if (confirmed === 'true') {
				await user.delete({ where: { id: +params.id } });
			}
		} catch (error) {
			return fail(400, { error: error.message });
		}
		throw redirect(302, '/users');
	}
};
