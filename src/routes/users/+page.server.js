import { user } from '$lib/db.js';
import { capitalize } from '$lib/helpers.js';
import { parseData, pojoData } from '$lib/serverHelpers.js';

export async function load() {
	let columns = [
		{ id: 'id', name: 'Admn. no', type: 'number' },
		{ id: 'name' },
		{
			id: 'gender',
			type: 'select',
			items: [
				{ value: 'M', label: 'Male' },
				{ value: 'F', label: 'Female' }
			],
			opts: { creatable: false }
		},
		{ id: 'details' },
		{ id: 'email_address', type: 'email' }
	].map((data) => ({ ...data, name: data.name || capitalize(data.id) }));
	let users = await user.findMany({
		select: { id: true, name: true, email_address: true, gender: true, details: true }
	});
	return { columns, users };
}

export const actions = {
	create: async function ({ request }) {
		let data = await pojoData(request);
		parseData(data, ['gender']);
		await user.create({
			data: {
				...data,
				id: +data.id,
				is_admin: false,
				password: data.id + data.name,
				gender: data.gender.value
			}
		});
	}
};
