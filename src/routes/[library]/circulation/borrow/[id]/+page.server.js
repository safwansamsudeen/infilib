import { item, user, transaction } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { getTransColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const item_obj = await item.findUnique({
		where: { id: +params.id }
	});
	if (item_obj.status === 'OUT') {
		throw redirect(303, `/${params.library}/circulation/`);
	}
	const transColumns = await getTransColumns();
	return {
		item: item_obj,
		columns: transColumns.map((column) =>
			column.id === 'item'
				? { ...column, opts: { ...column.opts, disabled: true, value: item_obj.title } }
				: column
		)
	};
}

export const actions = {
	borrow: async function ({ request, params }) {
		let { item: _, ...requestData } = await pojoData(request);
		const item_obj = await item.findUnique({ where: { id: +params.id } });
		if (item_obj.status === 'OUT') {
			return fail(400, { incorrect: true, label: 'item' });
		}
		const transColumns = (await getTransColumns()).filter(
			({ id }) => !['item', 'returned_at', 'id'].includes(id)
		);
		const check = parseProperties(requestData, transColumns);
		if (check) return new fail(400, check);
		let data = {
			item: {
				connect: {
					id: +params.id
				}
			}
		};
		const res = await response(async () => {
			for (let { id } of transColumns) data[id] = requestData[id];
			await transaction.create({ data });
			await item.update({ where: { id: +params.id }, data: { status: 'OUT' } });
		}, true);
		if (res) return res;
		throw redirect(303, `/${params.library}/circulation/`);
	}
};
