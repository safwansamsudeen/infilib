import { user } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';

import { getUserColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';
import { standardizeSelects } from '$lib/helpers.js';

export async function load() {
	const userColumns = await getUserColumns();
	return {
		columns: userColumns,
		users: {
			data: new Promise(async (fulfil) => {
				const users = await user.findMany({
					select: { id: true, name: true, email_address: true, gender: true, details: true }
				});
				standardizeSelects(users, userColumns);
				fulfil(users);
			})
		}
	};
}

export const actions = {
	create: async function ({ request }) {
		let requestData = await pojoData(request);
		let check = parseProperties(requestData, await getUserColumns());
		if (check) return new fail(400, check);
		return response(async () => {
			let data = {
				is_admin: false,
				password: requestData.id + requestData.name
			};
			const columns = await getUserColumns();
			for (let { id } of columns) data[id] = requestData[id];
			await user.create({
				data
			});
		});
	}
};
