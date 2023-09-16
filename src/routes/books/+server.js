import { response } from '$lib/helpers.js';
import { borrowable } from '$lib/db.js';

export async function PATCH({ request }) {
	const { id, property, value } = await request.json();
	let data = {};
	data[property] = value;
	return response(async () => await borrowable.update({ where: { acc_no: +id }, data }));
}

export async function DELETE({ request }) {
	const { id } = await request.json();

	return response(async () => {
		await borrowable.delete({ where: { acc_no: +id } });
	});
}
