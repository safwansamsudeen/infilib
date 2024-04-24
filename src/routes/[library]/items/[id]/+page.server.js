import { item, transaction } from '$lib/db';
import { injectLibraryInSelect, addDefaults, flatten, findOr404, pojoData, response } from '$lib/helpers';
import {
	getBookColumns,
	getItemColumns,
	getMagazineColumns,
	getTransColumns
} from '$lib/columns';
import { validateAndClean } from '$lib/validators';
import { fail, redirect } from '@sveltejs/kit';

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

	const transColumns = (getTransColumns(params.library)).filter(({ id }) => id !== 'item');

	const columns = getItemColumns(params.library);

	// Find type of item
	const type = item_obj.book ? 'book' : 'magazine';
	const otherColumns = (type === 'book' ? getBookColumns : getMagazineColumns)(params.library);
	flatten([item_obj], type);

	const transactions = await transaction.findMany({
		where: { item_id: +params.id, deleted: { not: true } },
		include: { user: true, subscription: true }
	});

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
		return response(async () => {
			let requestData = await pojoData(request);
			const type = requestData.type;
			delete requestData.type;
			let itemColumns = getItemColumns();
			const otherColumns = (type === 'book' ? getBookColumns : getMagazineColumns)();

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
		});
	},
	delete: async ({ params }) => {
		await response(async () => {
			await item.delete({ where: { id: +params.id } });
		});
		redirect(301, `/${params.library}/items`);
	}
};
