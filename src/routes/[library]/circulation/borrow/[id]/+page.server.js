import { item, user, transaction, mark } from '$lib/db';
import { validateAndClean } from '$lib/validators';
import { getTransColumns } from '$lib/columns';
import { getUserSubscription, findOr404, pojoData, response } from '$lib/helpers';

import { fail, redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';

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
			redirect(303, `/${params.library}/circulation/`);
		}
	}

	if (user_id) {
		user_obj = await findOr404(user, {
			where: { id: +user_id, subscriptions: { some: { type: { library_slug: params.library } } } },
			include: { subscriptions: { include: { type: true } } }
		});
		subscription = getUserSubscription(user_obj, params.library).type;
	}

	const values = {
		item: item_obj && { title: item_obj.title, id: item_obj.id },
		user: user_obj && { name: user_obj.name, id: user_obj.id },
		subscription: subscription && { id: subscription.id, name: subscription.name },
		price:
			subscription && subscription.name !== 'Membership'
				? 0
				: Math.floor(item_obj?.purchase_price / 10),
		issued_at: dayjs().format('YYYY-MM-DD'),
		due_at: dayjs()
			.add(subscription?.no_of_days || 4, 'day')
			.format('YYYY-MM-DD')
	};

	async function getColumns() {
		let columns = getTransColumns(params.library)
		for (let column of columns) {
			column.opts = {
				...column.opts,
				options: column.opts?.options ? (await column.opts.options) : [],
				value: values[column.id]
			}
		}
		return columns;
	}

	return {
		mark_id,
		item: item_obj,
		user: user_obj,
		columns: await getColumns()
	};
}

export const actions = {
	borrow: async function ({ request, params, locals }) {
		const { mark_id, ...requestData } = await pojoData(request);

		const transColumns = (await getTransColumns(params.library)).filter(
			({ id }) => !['returned_at', 'id'].includes(id)
		);
		const check = validateAndClean(requestData, transColumns);
		if (check && !(locals.library.settings.is_free && check.name === 'Price')) {
			return new fail(400, check);
		}
		const item_obj = await item.findUnique({ where: { id: +requestData.item.connect.id } });
		if (item_obj.status === 'OUT') {
			return fail(400, { incorrect: true, name: 'item', value: 'this item is already borrowed.' });
		}

		const all_transactions = await transaction.findMany({
			where: {
				subscription: {
					user_id: +requestData.user.connect.id,
					type: { library_slug: params.library }
				},
				returned_at: null,
				deleted: false
			},
			include: { subscription: { include: { type: true } } }
		});
		if (
			all_transactions.length &&
			all_transactions.length >= all_transactions[0].subscription.type.no_of_books
		) {
			return fail(400, {
				incorrect: true,
				name: 'User',
				value: 'this user has too many items borrowed'
			});
		}

		requestData.subscription = {
			connect: {
				type_id_user_id: {
					type_id: requestData.subscription.connect.id,
					user_id: +requestData.user.connect.id
				}
			}
		};
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
		redirect(303, `/${params.library}/circulation/`);
	}
};
