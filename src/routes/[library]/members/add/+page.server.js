import { getUserColumns } from '$lib/columns';
import { pojoData } from '$lib/helpers';
import { user } from '$lib/db';
import { validateAndClean } from '$lib/validators';
import { redirect, fail } from '@sveltejs/kit';
import { response } from '$lib/helpers';

export async function load({ params }) {
	const columns = await getUserColumns(params.library, true);
	return { columns };
}

export const actions = {
	create: async ({ request, params }) => {
		const requestData = await pojoData(request);

		const userColumns = getUserColumns(params.library);
		let check = validateAndClean(requestData, userColumns);
		if (check) return new fail(400, check);

		// Modifications specific to User model
		requestData.gender = requestData.gender.connect.id;
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
		redirect(303, `/${params.library}/members`);
	}
};
