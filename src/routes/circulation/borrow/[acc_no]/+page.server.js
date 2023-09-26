import { borrowable, user, transaction } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';
import { pojoData } from '$lib/serverHelpers.js';

export async function load({ params }) {
	const borrowable_obj = await borrowable.findUnique({
		where: { acc_no: +params.acc_no }
	});
	const users = await user.findMany();
	return {
		borrowable: borrowable_obj,
		users: users.map(({ id, name }) => ({ value: id, label: name }))
	};
}

export const actions = {
	borrow: async function ({ request, params }) {
		let { issued_at, due_at, comments, user_id } = await pojoData(request);
		await transaction.create({
			data: {
				borrowable_id: +params.acc_no,
				user_id: JSON.parse(user_id).value,
				issued_at: new Date(issued_at),
				due_at: new Date(due_at),
				comments
			}
		});
		throw redirect(303, '/circulation/');
	}
};
