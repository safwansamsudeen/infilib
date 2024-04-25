import { item, mark } from '$lib/db';
import { getMarkColumns } from '$lib/columns';
import { getCurrentUser } from '$lib/auth';
import { date, pojoData } from '$lib/helpers';

import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	let item_obj = await item.findUnique({ where: { id: +params.id }, include: { mark: true } });
	if (item_obj.mark) {
		redirect(303, `/${params.library}/public/`);
	}
	return {
		item_name: item_obj.title,
		item_price: Math.floor(item_obj.purchase_price / 10),
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
		redirect(303, `/${params.library}/public/`);
	}
};
