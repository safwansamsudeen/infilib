import { getBookColumns, getItemColumns, getMagazineColumns } from '$lib/columns';
import { item, librarySubscription } from '$lib/db';
import { validateAndClean } from '$lib/validators';
import { redirect, fail } from '@sveltejs/kit';
import { findValue, injectLibraryInSelect, response, pojoData } from '$lib/helpers';

export async function load({ params }) {
	const itemColumns = await getItemColumns(params.library, true);
	const otherColumns = {
		book: await getBookColumns(params.library, true),
		magazine: await getMagazineColumns()
	};

	// Autofill accession number
	findValue(itemColumns, 'acc_no').opts = {
		value:
			((
				await item.findMany({
					take: 1,
					where: { library_slug: params.library },
					orderBy: { acc_no: 'desc' }
				})
			)[0]?.acc_no || 0) + 1
	};
	return {
		itemColumns,
		otherColumns,
		librarySubscriptions: await librarySubscription.findMany({
			where: { library_slug: params.library },
			include: { publisher: true, categories: true, languages: true }
		})
	};
}

export const actions = {
	create: async ({ request, params }) => {
		const requestData = await pojoData(request);

		const itemColumns = await getItemColumns(params.library);

		const type = requestData.type;
		const multiple = requestData.multiple === 'true';
		delete requestData.type;
		delete requestData.multiple;

		const otherColumns = await (type === 'book' ? getBookColumns : getMagazineColumns)();

		let check = validateAndClean(requestData, [
			...itemColumns,
			{ id: type, type: 'object', columns: otherColumns }
		]);
		console.log()
		if(check) return new fail(400, check);

		// Modifications specific to types
		// Adding library fields
		requestData.library = { connect: { slug: params.library } };
		requestData.publisher = injectLibraryInSelect(requestData.publisher, params.library);
		requestData.categories = injectLibraryInSelect(requestData.categories, params.library);

		if (type === 'book') {
			requestData.book.create.authors = injectLibraryInSelect(
				requestData.book.create.authors,
				params.library
			);
		} else {
			requestData.magazine.create.subscription_id = JSON.parse(requestData.library_subscription).id
			delete requestData.library_subscription;
		}
		console.log(requestData)

		const res = await response(async () => {
			await item.create({ data: requestData });
		}, true);
		if (res) return res;
		if (multiple) {
			redirect(303, `/${params.library}/items/add?multiple=true`);
		}
		redirect(303, `/${params.library}/items`);
	}
};
