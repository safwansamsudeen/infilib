import { borrowable } from '$lib/db.js';
import {
	pojoData,
	flattenBorrowables,
	columns,
	parseBorrowable,
	pojofyColumns,
	response
} from '$lib/serverHelpers.js';
import { fail } from '@sveltejs/kit';

export async function load({ url }) {
	return await response(async () => {
		let params = {};
		let include = {
			publisher: true,
			categories: true,
			languages: true
		};
		let borrowableColumns = await columns('borrowable'),
			bookColumns = await columns('book'),
			magazineColumns = await columns('magazine');
		let allColumns = borrowableColumns;
		let type;
		for (let [key, val] of url.searchParams.entries()) {
			if (key === 'show') {
				if (val === 'book') {
					params.book = { isNot: null };
					include.book = { include: { authors: true } };
					allColumns = allColumns.concat(bookColumns);
				} else if (val === 'magazine') {
					params.magazine = { isNot: null };
					include.magazine = true;
					allColumns = allColumns.concat(magazineColumns);
				}
				type = val;
			} else if (val) {
				params[key] = val;
			}
		}
		let borrowables = await borrowable.findMany({
			include,
			where: params
		});
		borrowables = flattenBorrowables(
			borrowables,
			borrowableColumns,
			bookColumns,
			magazineColumns,
			type
		);
		return {
			borrowables,
			borrowableColumns: pojofyColumns(borrowableColumns),
			bookColumns: pojofyColumns(bookColumns),
			magazineColumns: pojofyColumns(magazineColumns),
			columns: allColumns
		};
	}, true);
}

export const actions = {
	create: async function ({ request }) {
		try {
			const data = await pojoData(request);
			await parseBorrowable(data);
		} catch (e) {
			console.log(e);
			return fail(500, {});
		}
	}
};
