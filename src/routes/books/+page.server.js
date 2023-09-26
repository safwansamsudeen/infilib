import { item } from '$lib/db.js';
import {
	pojoData,
	flattenItems,
	columns,
	parseItem,
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
		let itemColumns = await columns('item'),
			bookColumns = await columns('book'),
			magazineColumns = await columns('magazine');
		let allColumns = itemColumns;
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
		let items = await item.findMany({
			include,
			where: params
		});
		items = flattenItems(items, itemColumns, bookColumns, magazineColumns, type);
		return {
			items,
			itemColumns: pojofyColumns(itemColumns),
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
			await parseItem(data);
		} catch (e) {
			console.log(e);
			return fail(500, {});
		}
	}
};
