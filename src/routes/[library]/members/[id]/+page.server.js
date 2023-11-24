import { transaction, user, userSubscription } from '$lib/db.js';
import { standardizeSelects } from '$lib/helpers.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { parseProperties } from '$lib/validators.js';
import { fail, redirect } from '@sveltejs/kit';
import { getTransColumns, getUserColumns } from '$lib/columns.js';

export async function load({ params }) {
	const user_obj = await user.findUnique({
		where: {
			id: +params.id,
			subscriptions: { some: { library_slug: { equals: params.library } } }
		},
		include: { gender: true, subscriptions: true }
	});
	const transColumns = (await getTransColumns()).filter(({ id }) => id !== 'user');
	const userColumns = await getUserColumns();

	const transactions = await transaction.findMany({
		where: {
			user_id: +params.id
			// subscriptions: { some: { library_slug: { equals: params.library } } }
		},
		include: { item: true }
	});
	standardizeSelects(transactions, transColumns);
	standardizeSelects([user_obj], userColumns);
	return {
		user: user_obj,
		transactions,
		columns: userColumns.map(({ opts, ...data }) => ({
			...data,
			opts: { ...opts, value: user_obj[data.id], disabled: data.id === 'id' }
		})),
		transColumns
	};
}

export const actions = {
	update: async ({ request, params }) => {
		let data = await pojoData(request);
		let check = parseProperties(
			data,
			(await getUserColumns()).filter(({ id }) => id !== 'id')
		);
		if (check) return new fail(400, check);
		return response(async () => {
			await user.update({
				where: { id: +params.id },
				data
			});
		});
	},
	delete: async ({ params }) => {
		try {
			// TODO: deactivate subscription instead
			const subscription = await userSubscription.findFirst({
				where: { library_slug: params.library, users: { some: { id: +params.id } } }
			});
			console.log(subscription);
			await user.update({
				where: { id: +params.id },
				data: { subscriptions: { disconnect: { id: subscription.id } } }
			});
		} catch (error) {
			console.log(error);
			return fail(400, { error: error.message });
		}
		throw redirect(302, `/${params.library}/members`);
	}
};
