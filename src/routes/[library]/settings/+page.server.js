import { getSubscriptionColumns, getTransColumns } from '$lib/columns.js';
import { pojoData } from '$lib/serverHelpers.js';
import { validateAndClean } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';
import { subscriptionType, library } from '$lib/db.js';

export async function load() {
	return { subsColumns: await getSubscriptionColumns() };
}

export const actions = {
	create: async ({ request, params }) => {
		const requestData = await pojoData(request);
		const columns = (await getSubscriptionColumns()).filter(
			({ id }) => !['returned_at', 'id'].includes(id)
		);
		const check = validateAndClean(requestData, columns);
		if (check) return new fail(400, check);
		let data = { library_slug: params.library };
		for (let { id } of columns) data[id] = requestData[id];
		await subscriptionType.create({ data });
	},
	update_settings: async ({ request, params }) => {
		const { is_free } = await pojoData(request);
		await library.update({
			where: { slug: params.library },
			data: { settings: { update: { is_free: is_free ? true : false } } }
		});
	}
};
