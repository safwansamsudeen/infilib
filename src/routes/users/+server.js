import { response } from '$lib/helpers.js';
import { user } from '$lib/db.js';

export async function PATCH({ request }) {
	const { id, property, value } = await request.json();
	let data = {};
	data[property] = value;
	return response(async () => await user.update({ where: { id: +id }, data }));
}

export async function DELETE({ request }) {
	const { id } = await request.json();
	return response(async () => await user.delete({ where: { id: +id } }));
}
