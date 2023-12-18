import { getBookColumns, getItemColumns, getMagazineColumns } from '$lib/columns.js';
import { pojoData } from '$lib/serverHelpers.js';
import { item, library } from '$lib/db.js';
import { validateAndClean } from '$lib/validators.js';
import { redirect, fail } from '@sveltejs/kit';
import { response } from '$lib/serverHelpers.js';
import { injectLibraryInSelect } from '$lib/helpers.js';

export async function load({ params }) {
	const itemColumns = await getItemColumns(params.library, true);
	const otherColumns = {
		book: await getBookColumns(params.library, true),
		magazine: await getMagazineColumns()
	};
	return { itemColumns, otherColumns };
}

export const actions = {
	create: async ({ request, params }) => {
		const requestData = await pojoData(request);
		const itemColumns = await getItemColumns(params.library);

		const type = requestData.type;
		delete requestData.type;
		const otherColumns = await (type === 'book' ? getBookColumns : getMagazineColumns)();

		let check = validateAndClean(requestData, [
			...itemColumns,
			{ id: type, type: 'object', columns: otherColumns }
		]);
		if (check) return new fail(400, check);

		// Modifications specific to Item model
		// Adding library fields
		requestData.library = { connect: { slug: params.library } };
		requestData.publisher = injectLibraryInSelect(requestData.publisher, params.library);
		requestData.categories = injectLibraryInSelect(requestData.categories, params.library);

		if (type === 'book') {
			requestData.book.create.authors = injectLibraryInSelect(
				requestData.book.create.authors,
				params.library
			);
		}

		const res = await response(async () => {
			await item.create({ data: requestData });
		}, true);
		if (res) return res;

		throw redirect(303, `/${params.library}/items`);
	}
};
