import { getSubscriptionColumns, getLibrarySubscriptionColumns } from '$lib/columns';
import { validateAndClean } from '$lib/validators';
import { injectLibraryInSelect, pojoData, response } from '$lib/helpers';
import { subscriptionType, librarySubscription, library } from '$lib/db';

import { fail } from '@sveltejs/kit';

export async function load({ params }) {
	return {
		subsColumns: getSubscriptionColumns(),
		librarySubsColumns: getLibrarySubscriptionColumns(params.library)
	};
}

export const actions = {
	create_subscription: async ({ request, params }) => {
		const requestData = await pojoData(request);
		const columns = (getSubscriptionColumns()).filter(
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
	update_settings: async ({ request, params }) => {
		const { is_free } = await pojoData(request);
		await library.update({
			where: { slug: params.library },
			data: { settings: { update: { is_free: is_free ? true : false } } }
		});
	},
	create_library_subscription: async ({ request, params }) => {
		const requestData = await pojoData(request);
		const columns = getLibrarySubscriptionColumns();
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
