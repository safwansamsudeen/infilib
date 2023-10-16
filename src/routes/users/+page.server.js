import { user } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';

import { getUserColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';
import { standardizeSelects } from '$lib/helpers.js';

export async function load() {
	const userColumns = await getUserColumns();
	const users = await user.findMany({
		select: { id: true, name: true, email_address: true, gender: true, details: true }
	});
	standardizeSelects(users, userColumns);
	return { columns: userColumns, users };
}

export const actions = {
	create: async function ({ request }) {
		let data = await pojoData(request);
		let check = parseProperties(data, await getUserColumns());
		if (check) return new fail(400, check);
		return response(async () => {
			await user.create({
				data: {
					id: data.id,
					name: data.name,
					gender: { connect: { code: data.gender.value } },
					email_address: data.email_address,
					details: data.details,
					is_admin: false,
					password: data.id + data.name
				}
			});
		});
	}
};
