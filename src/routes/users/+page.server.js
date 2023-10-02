import { user } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';

import { getUserColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { fail } from '@sveltejs/kit';

export async function load() {
	let users = await user.findMany({
		select: { id: true, name: true, email_address: true, gender: true, details: true }
	});
	return { columns: getUserColumns(), users };
}

export const actions = {
	create: async function ({ request }) {
		let data = await pojoData(request);
		let check = parseProperties(data, await getUserColumns());
		if (check) return new fail(400, check);
		try {
			await user.create({
				data: {
					...data,
					is_admin: false,
					password: data.id + data.name
				}
			});
		} catch (error) {
			return fail(400, { error: error });
		}
	}
};
