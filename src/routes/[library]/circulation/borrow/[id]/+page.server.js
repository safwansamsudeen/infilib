import { item, user, transaction, mark } from '$lib/db.js';
import { findOr404, pojoData, response } from '$lib/serverHelpers.js';
import { getTransColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ params, url }) {
	let item_obj, user_obj, subscription;
	let item_id = params.id,
		user_id = url.searchParams.get('user');

	let mark_id = url.searchParams.get('mark');
	if (mark_id) {
		const mark_obj = await findOr404(mark, { where: { id: +mark_id } });
		item_id = mark_obj.item_id;
		user_id = mark_obj.user_id;
	}

	if (item_id !== 'any') {
		item_obj = await findOr404(item, { where: { id: +item_id } });
		if (item_obj.status === 'OUT') {
			throw redirect(303, `/${params.library}/circulation/`);
		}
	}

	if (user_id) {
		user_obj = await findOr404(user, {
			where: { id: +user_id },
			include: { subscriptions: { include: { type: true } } }
		});
		subscription = user_obj.subscriptions.find(
			({ type }) => type.library_slug === params.library
		).type;
	}

	const transColumns = (await getTransColumns(params.library)).map((column) => {
		if (item_obj) {
			if (column.id === 'item') {
				return {
					...column,
					opts: {
						...column.opts,
						disabled: true,
						value: { label: item_obj.title, value: item_obj.id }
					}
				};
			}
		}
		if (user_obj) {
			if (column.id === 'user') {
				return {
					...column,
					opts: {
						...column.opts,
						disabled: true,
						value: { label: user_obj.name, value: user_obj.id }
					}
				};
			} else if (column.id === 'subscription') {
				return {
					...column,
					opts: {
						...column.opts,
						disabled: true,
						value: {
							label: subscription.name,
							value: subscription.id
						}
					}
				};
			}
		}
		if (column.id === 'price') {
			console.log(Math.floor(item_obj?.purchase_price / 10), subscription);
			return {
				...column,
				opts: {
					...column.opts,
					value:
						subscription && subscription?.name !== 'Membership'
							? 0
							: Math.floor(item_obj?.purchase_price / 10)
				}
			};
		}
		return column;
	});
	return {
		mark_id,
		item: item_obj,
		user: user_obj,
		columns: transColumns
	};
}

export const actions = {
	borrow: async function ({ request, params }) {
		const { mark_id, ...requestData } = await pojoData(request);

		const transColumns = (await getTransColumns(params.library)).filter(
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
			if (mark_id) {
				await mark.delete({ where: { id: +mark_id } });
			}
		}, true);
		if (res) return res;
		throw redirect(303, `/${params.library}/circulation/`);
	}
};
