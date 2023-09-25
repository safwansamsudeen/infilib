import { author, borrowable, category, language, publisher, transaction } from '$lib/db.js';
import {
	pojoData,
	flattenBorrowables,
	borrowableColumns,
	parseBorrowable,
	response
} from '$lib/serverHelpers.js';
import { redirect } from '@sveltejs/kit';

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
	[borrowable_obj] = flattenBorrowables([borrowable_obj], true);

	const transactions = await transaction.findMany({
		where: { borrowable_id: +params.acc_no },
		include: { user: true }
	});
	return {
		borrowableColumns: await borrowableColumns('borrowable'),
		bookColumns: Object.hasOwn(borrowable_obj, 'authors') && (await borrowableColumns('book')),
		magazineColumns:
			Object.hasOwn(borrowable_obj, 'sc_no') && (await borrowableColumns('magazine')),
		borrowable: borrowable_obj,
		transactions: transactions.map(({ user, issued_at, due_at, returned_at, comments }) => [
			user.name,
			issued_at.toDateString(),
			due_at.toDateString(),
			returned_at?.toDateString() || 'NA',
			comments
		])
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
				console.log(confirmed);
				if (confirmed === 'true') {
					await borrowable.delete({ where: { acc_no: +params.acc_no } });
				}
			},
			redirect('/books', 200)
		);
	}
};
