import { item, transaction } from '$lib/db.js';
import { findOr404, pojoData, response } from '$lib/serverHelpers.js';
import { fail, redirect } from '@sveltejs/kit';
import { prettify, injectLibraryInSelect, addDefaults, flatten } from '$lib/helpers.js';
import {
	getBookColumns,
	getItemColumns,
	getMagazineColumns,
	getTransColumns
} from '$lib/columns.js';
import { validateAndClean } from '$lib/validators.js';

export async function load({ params }) {
	let item_obj = await findOr404(item, {
		where: { id: +params.id },
		include: {
			book: { include: { authors: true } },
			magazine: true,
			publisher: true,
			categories: true,
			languages: true
		}
	});

	const transColumns = (await getTransColumns(params.library)).filter(({ id }) => id !== 'item');

	const columns = await getItemColumns(params.library, true);

	// Find type of item
	const type = item_obj.book ? 'book' : 'magazine';
	const otherColumns = await (type === 'book' ? getBookColumns : getMagazineColumns)(
		params.library,
		true
	);
	flatten([item_obj], type);

	const transactions = await transaction.findMany({
		where: { item_id: +params.id },
		include: { user: true }
	});

	prettify(transactions, transColumns);

	return {
		item: item_obj,
		transactions,
		columns: [...columns, { id: type, type: 'object', columns: otherColumns }].map((col) =>
			addDefaults(item_obj, col)
		),
		transColumns
	};
}

export const actions = {
	update: async ({ request, params }) => {
		return await response(async () => {
			let requestData = await pojoData(request);
			const type = requestData.type;
			delete requestData.type;
			let itemColumns = await getItemColumns();
			const otherColumns = await (type === 'book' ? getBookColumns : getMagazineColumns)();

			let check = validateAndClean(
				requestData,
				[...itemColumns, { id: type, type: 'object', columns: otherColumns }],
				'update'
			);
			if (check) return new fail(400, check);

			// Do item specific stuff
			requestData.library = { connect: { slug: params.library } };
			requestData.publisher = injectLibraryInSelect(requestData.publisher, params.library);
			requestData.categories = injectLibraryInSelect(requestData.categories, params.library);

			if (type === 'book') {
				requestData.book.update.authors = injectLibraryInSelect(
					requestData.book.update.authors,
					params.library
				);
			}

			await item.update({ where: { id: +params.id }, data: requestData });
		}, true);
	},
	delete: async ({ params }) => {
		await response(async () => {
			await item.delete({ where: { id: +params.id } });
		});
		throw redirect(301, `/${params.library}/items`);
	}
};
