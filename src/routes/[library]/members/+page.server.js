import { user } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';

import { getUserColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';
import { standardize } from '$lib/helpers.js';

export async function load({ params }) {
	let library_slug = params.library;
	return {
		streamed: {
			users: new Promise(async (res) => {
				const userColumns = await getUserColumns(library_slug);

				let users = await user.findMany({
					where: { subscriptions: { some: { library_slug } } },
					include: { gender: true, subscriptions: { include: { type: true } } },
					cacheStrategy: { swr: 60, ttl: 60 }
				});

				users = users.map(({ subscriptions, ...user_obj }) => ({
					...user_obj,
					subscriptions: subscriptions.map((subscription) => ({
						id: subscription.type.id,
						label: subscription.type.name
					}))
				}));
				standardize(users, userColumns);

				res({
					users,
					userColumns
				});
			})
		}
	};
}

export const actions = {
	create: async function ({ request, params }) {
		let requestData = await pojoData(request);
		const userColumns = await getUserColumns(params.library);
		let check = parseProperties(requestData, userColumns);
		if (check) return new fail(400, check);

		return response(async () => {
			let data = {};
			const currentUser = await user.findUnique({
				where: { email_address: requestData.email_address }
			});
			const { id: type_id } = requestData.subscriptions.connect;
			requestData.subscriptions = { create: { type_id, library_slug: params.library } };
			if (currentUser) {
				await user.update({
					where: { email_address: requestData.email_address },
					data: {
						subscriptions: requestData.subscriptions
					}
				});
			} else {
				for (let { id } of userColumns) data[id] = requestData[id];
				await user.create({ data });
			}
		});
	}
};
