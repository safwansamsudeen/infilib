import { user } from '$lib/db.js';
import { pojoData } from '$lib/helpers.js';

export async function load() {
	let users = await user.findMany({});
	let columns = [
		{ name: 'id', label: 'Admn. no', type: 'number' },
		{ name: 'name' },
		{ name: 'email_address', label: 'Email Address', type: 'email' },
		{ name: 'details' },
		{
			name: 'gender',
			type: 'select',
			values: [
				{ value: 'M', label: 'Male' },
				{ value: 'F', label: 'Female' }
			]
		}
	];
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
	},
	update: async function ({ request }) {
		const { id, property, value } = await pojoData(request);
		let data = {};
		data[property] = value;
		await user.update({ where: { id: +id }, data });
	},
	delete: async function ({ request }) {
		const { id } = await pojoData(request);
		await user.delete({ where: { id: +id } });
	}
};
