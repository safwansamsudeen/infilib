import { getUserColumns } from '$lib/columns.js';
import { pojoData } from '$lib/serverHelpers.js';
import { user } from '$lib/db.js';
import { validateAndClean } from '$lib/validators.js';
import { redirect } from '@sveltejs/kit';
import { response } from '$lib/serverHelpers.js';

export async function load({ params }) {
	const columns = await getUserColumns(params.library, true);
	return { columns };
}

export const actions = {
	create: async ({ request, params }) => {
		const requestData = await pojoData(request);

		const userColumns = await getUserColumns(params.library);
		let check = validateAndClean(requestData, userColumns);
		if (check) return check;

		// Modifications specific to User model
		requestData.gender = requestData.gender.connect.value;
		requestData.subscriptions = requestData.subscription;
		delete requestData.subscription;

		const res = await response(async () => {
			await user.upsert({
				where: { email_address: requestData.email_address },
				update: { subscriptions: requestData.subscriptions },
				create: requestData
			});
		}, true);
		if (res) return res;
		throw redirect(303, `/${params.library}/members`);
	}
};
