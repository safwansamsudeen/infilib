import { serverResponse } from '$lib/serverHelpers.js';
import { user } from '$lib/db.js';
import { validateUserProperty } from '$lib/validators.js';

export async function PATCH({ request }) {
	const { id, property, value } = await request.json();
	return await serverResponse(async () => {
		validateUserProperty(value, property);
		await user.update({ where: { id: +id }, data: { [property]: value } });
	});
}

export async function DELETE({ request }) {
	const { id } = await request.json();
	return serverResponse(async () => await user.delete({ where: { id: +id } }));
}
