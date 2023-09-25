import { user } from '$lib/db.js';
import { capitalize } from '$lib/helpers.js';
import { pojoData } from '$lib/serverHelpers.js';

export async function load() {
	let users = await user.findMany({});
	let columns = [
		{ id: 'id', name: 'Admn. no', type: 'number' },
		{ id: 'name' },
		{ id: 'email_address', type: 'email' },
		{ id: 'details' },
		{
			id: 'gender',
			type: 'select',
			values: [
				{ value: 'M', name: 'Male' },
				{ value: 'F', name: 'Female' }
			],
			opts: { creatable: false }
		}
	].map((data) => ({ ...data, name: data.name || capitalize(data.id) }));
	users = users.map(({ id, name, email_address, details, gender }) => [
		id,
		name,
		email_address,
		details,
		gender
	]);
	return { columns, users };
}

export const actions = {
	create: async function ({ request }) {
		let data = await pojoData(request);
		await user.create({
			data: { ...data, id: +data.id, is_admin: false, password: data.id + data.name }
		});
	}
};
