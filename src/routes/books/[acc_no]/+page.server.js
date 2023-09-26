import { item, transaction } from '$lib/db.js';
import {
	pojoData,
	flattenItems,
	columns,
	parseItem,
	response,
	pojofyColumns
} from '$lib/serverHelpers.js';
import { redirect } from '@sveltejs/kit';
import { date } from '$lib/helpers.js';

export async function load({ params }) {
	let item_obj = await item.findUnique({
		where: { acc_no: +params.acc_no },
		include: {
			book: { include: { authors: true } },
			magazine: true,
			publisher: true,
			categories: true,
			languages: true
		}
	});
	const isBook = Object.hasOwn(item_obj, 'book');
	let itemColumns = await columns('item'),
		bookColumns = isBook && (await columns('book')),
		magazineColumns = !isBook && (await columns('magazine'));
	[item_obj] = await flattenItems(
		[item_obj],
		itemColumns,
		bookColumns,
		magazineColumns,
		isBook ? 'book' : 'magazine',
		false
	);

	const transactions = await transaction.findMany({
		where: { item_id: +params.acc_no },
		include: { user: true }
	});
	return {
		item: item_obj,
		transactions: transactions.map(({ user, issued_at, due_at, returned_at, comments }) => [
			user.name,
			date(issued_at),
			date(due_at),
			date(returned_at) || 'NA',
			comments
		]),
		itemColumns: pojofyColumns(itemColumns),
		bookColumns: pojofyColumns(bookColumns),
		magazineColumns: pojofyColumns(magazineColumns)
	};
}

export const actions = {
	update: async ({ request }) => {
		return await response(async () => {
			const data = await pojoData(request);
			await parseItem(data, false);
		});
	},
	delete: async ({ request, params }) => {
		return await response(
			async () => {
				const { confirmed } = await pojoData(request);
				if (confirmed === 'true') {
					await item.delete({ where: { acc_no: +params.acc_no } });
				}
			},
			redirect('/books', 200)
		);
	}
};
