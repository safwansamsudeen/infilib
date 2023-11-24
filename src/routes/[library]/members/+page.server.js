import { user } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';

import { getUserColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';
import { standardizeSelects } from '$lib/helpers.js';

export async function load({ params }) {
	const userColumns = await getUserColumns();
	return {
		columns: userColumns,
		users: {
			data: new Promise(async (fulfil) => {
				const users = await user.findMany({
					where: { subscriptions: { some: { library_slug: { equals: params.library } } } },
					include: { gender: true, subscriptions: true }
				});
				standardizeSelects(users, userColumns);
				fulfil(users);
			})
		}
	};
}

export const actions = {
	create: async function ({ request, params }) {
		let requestData = await pojoData(request);
		let check = parseProperties(requestData, await getUserColumns());
		if (check) return new fail(400, check);
		return response(async () => {
			let data = {};
			const columns = await getUserColumns();
			const currentUser = await user.findUnique({
				where: { email_address: requestData.email_address }
			});
			if (currentUser) {
				await user.update({
					where: { email_address: requestData.email_address },
					data: {
						subscriptions: requestData.subscriptions
					}
				});
			} else {
				for (let { id } of columns) data[id] = requestData[id];
				await user.create({ data });
			}
		});
	}
};
