import { item, mark } from '$lib/db.js';
import { getMarkColumns, getTransColumns } from '$lib/columns.js';
import { pojoData } from '$lib/serverHelpers.js';
import { getCurrentUser } from '$lib/auth.js';
import { date } from '$lib/helpers.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	let item_obj = await item.findUnique({ where: { id: +params.id }, include: { mark: true } });
	if (item_obj.mark) {
		throw redirect(303, `/${params.library}/public/`);
	}
	return {
		item_name: item_obj.title,
		columns: (await getMarkColumns()).map((column) =>
			column.id === 'item'
				? { ...column, opts: { ...column.opts, disabled: true, value: item_obj.title } }
				: column
		)
	};
}

export const actions = {
	mark: async function ({ request, params, cookies }) {
		let { item: _, comments, borrow_time } = await pojoData(request);
		const currentUser = await getCurrentUser(cookies.get('psg_auth_token'));
		await mark.create({
			data: {
				item_id: +params.id,
				user_id: currentUser.id,
				comments,
				borrow_time: date(borrow_time, false)
			}
		});
		throw redirect(303, `/${params.library}/public/`);
	}
};
