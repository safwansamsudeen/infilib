import { getSubscriptionColumns, getLibrarySubscriptionColumns } from '$lib/columns.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { validateAndClean } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';
import { injectLibraryInSelect } from '$lib/helpers.js';
import { subscriptionType, librarySubscription } from '$lib/db.js';

export async function load({ params }) {
	return {
		subsColumns: await getSubscriptionColumns(),
		librarySubsColumns: await getLibrarySubscriptionColumns(params.library)
	};
}

export const actions = {
	create_subscription: async ({ request, params }) => {
		const requestData = await pojoData(request);
		const columns = (await getSubscriptionColumns()).filter(
			({ id }) => !['returned_at', 'id'].includes(id)
		);
		const check = validateAndClean(requestData, columns);
		if (check) return new fail(400, check);
		let data = { library_slug: params.library };
		for (let { id } of columns) data[id] = requestData[id];
		return await response(async () => {
			await subscriptionType.create({ data });
		});
	},
	create_library_subscription: async ({ request, params }) => {
		const requestData = await pojoData(request);
		const columns = await getLibrarySubscriptionColumns();
		const check = validateAndClean(requestData, columns);
		if (check) return new fail(400, check);
		let data = { library: { connect: { slug: params.library } } };
		// Add library name for Prisma to get unique fields
		requestData.publisher = injectLibraryInSelect(requestData.publisher, params.library);
		requestData.categories = injectLibraryInSelect(requestData.categories, params.library);

		for (let { id } of columns) data[id] = requestData[id];
		return await response(async () => {
			await librarySubscription.create({ data });
		});
	}
};
