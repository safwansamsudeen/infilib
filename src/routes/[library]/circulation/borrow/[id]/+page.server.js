import { item, user, transaction } from '$lib/db.js';
import { findOr404, pojoData, response } from '$lib/serverHelpers.js';
import { getTransColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params, url }) {
	let item_obj;
	let user_obj;
	if (params.id !== 'any') {
		item_obj = await findOr404(item, { where: { id: +params.id } });
		if (item_obj.status === 'OUT') {
			throw redirect(303, `/${params.library}/circulation/`);
		}
	}
	const user_id = url.searchParams.get('user');
	if (user_id) {
		user_obj = await findOr404(user, { where: { id: +user_id } });
	}
	const transColumns = (await getTransColumns()).map((column) =>
		item_obj && column.id === 'item'
			? {
					...column,
					opts: {
						...column.opts,
						disabled: true,
						value: { label: item_obj.title, value: item_obj.id }
					}
			  }
			: user_obj && column.id === 'user'
			? {
					...column,
					opts: {
						...column.opts,
						disabled: true,
						value: { label: user_obj.name, value: user_obj.id }
					}
			  }
			: column
	);
	return {
		item: item_obj,
		user: user_obj,
		columns: transColumns
	};
}

export const actions = {
	borrow: async function ({ request, params, url }) {
		const requestData = await pojoData(request);
		const transColumns = (await getTransColumns()).filter(
			({ id }) => !['returned_at', 'id'].includes(id)
		);
		const check = parseProperties(requestData, transColumns);
		if (check) return new fail(400, check);
		const item_obj = await item.findUnique({ where: { id: +requestData.item.connect.id } });
		if (item_obj.status === 'OUT') {
			return fail(400, { incorrect: true, name: 'item', value: 'this item is already borrowed.' });
		}
		let data = {};
		for (let { id } of transColumns) data[id] = requestData[id];

		const res = await response(async () => {
			await transaction.create({ data });
			await item.update({ where: { id: item_obj.id }, data: { status: 'OUT' } });
		}, true);
		if (res) return res;
		throw redirect(303, `/${params.library}/circulation/`);
	}
};
