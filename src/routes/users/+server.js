import { serverResponse } from '$lib/serverHelpers.js';
import { user } from '$lib/db.js';
import { parseProperties, validateUserProperty } from '$lib/validators.js';
import { getUserColumns } from '$lib/columns.js';
import { findValue } from '$lib/helpers.js';

export async function PATCH({ request }) {
	const { id, property, value } = await request.json();
	return await serverResponse(async () => {
		let userColumns = await getUserColumns();
		const check = parseProperties({ id, [property]: value }, [
			findValue(userColumns, 'id', 'id'),
			findValue(userColumns, property, 'id')
		]);

		if (check) return { ...check, success: false, status_code: 400 };
		await user.update({ where: { id: +id }, data: { [property]: value } });
	});
}
