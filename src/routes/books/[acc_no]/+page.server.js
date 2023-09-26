import { borrowable, transaction } from '$lib/db.js';
import {
	pojoData,
	flattenBorrowables,
	columns,
	parseBorrowable,
	response,
	pojofyColumns
} from '$lib/serverHelpers.js';
import { redirect } from '@sveltejs/kit';
import { date } from '$lib/helpers.js';

export async function load({ params }) {
	let borrowable_obj = await borrowable.findUnique({
		where: { acc_no: +params.acc_no },
		include: {
			book: { include: { authors: true } },
			magazine: true,
			publisher: true,
			categories: true,
			languages: true
		}
	});
	const isBook = Object.hasOwn(borrowable_obj, 'book');
	let borrowableColumns = await columns('borrowable'),
		bookColumns = isBook && (await columns('book')),
		magazineColumns = !isBook && (await columns('magazine'));
	[borrowable_obj] = await flattenBorrowables(
		[borrowable_obj],
		borrowableColumns,
		bookColumns,
		magazineColumns,
		isBook ? 'book' : 'magazine',
		false
	);

	const transactions = await transaction.findMany({
		where: { borrowable_id: +params.acc_no },
		include: { user: true }
	});
	return {
		borrowable: borrowable_obj,
		transactions: transactions.map(({ user, issued_at, due_at, returned_at, comments }) => [
			user.name,
			date(issued_at),
			date(due_at),
			date(returned_at) || 'NA',
			comments
		]),
		borrowableColumns: pojofyColumns(borrowableColumns),
		bookColumns: pojofyColumns(bookColumns),
		magazineColumns: pojofyColumns(magazineColumns)
	};
}

export const actions = {
	update: async ({ request }) => {
		return await response(async () => {
			const data = await pojoData(request);
			await parseBorrowable(data, false);
		});
	},
	delete: async ({ request, params }) => {
		return await response(
			async () => {
				const { confirmed } = await pojoData(request);
				if (confirmed === 'true') {
					await borrowable.delete({ where: { acc_no: +params.acc_no } });
				}
			},
			redirect('/books', 200)
		);
	}
};
