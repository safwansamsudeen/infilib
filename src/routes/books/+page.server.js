import { borrowable, publisher, author, category, language } from '$lib/db.js';
import {
	pojoData,
	flattenBorrowables,
	borrowableColumns,
	parseBorrowable
} from '$lib/serverHelpers.js';
import { fail } from '@sveltejs/kit';

export async function load() {
	let borrowables = await borrowable.findMany({
		include: {
			publisher: true,
			book: {
				include: { authors: true }
			},
			magazine: true,
			categories: true,
			languages: true
		}
	});

	return {
		borrowables: flattenBorrowables(borrowables),
		borrowableColumns: await borrowableColumns('borrowable'),
		bookColumns: await borrowableColumns('book'),
		magazineColumns: await borrowableColumns('magazine')
	};
}

export const actions = {
	create: async function ({ request }) {
		try {
			const data = await pojoData(request);
			console.log(await parseBorrowable(data));
		} catch (e) {
			console.log(e);
			return fail(500, {});
		}
	}
};
