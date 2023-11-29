import { transaction, user, userSubscription } from '$lib/db.js';
import { standardize } from '$lib/helpers.js';
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
		include: { gender: true, subscriptions: { include: { type: true } } }
	});
	const transColumns = (await getTransColumns()).filter(({ id }) => id !== 'user');
	const userColumns = await getUserColumns();

	user_obj.subscriptions = user_obj.subscriptions.map((subscription) => ({
		id: subscription.type.id,
		label: subscription.type.name
	}));

	const transactions = await transaction.findMany({
		where: {
			user_id: +params.id
		},
		include: { item: true }
	});
	standardize(transactions, transColumns);
	standardize([user_obj], userColumns);
	return {
		user: user_obj,
		transactions,
		columns: userColumns.map(({ opts, ...data }) => ({
			...data,
			opts: {
				...opts,
				value: user_obj[data.id],
				disabled: data.id === 'id' || data.id === 'subscriptions'
			}
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
			const subscription = await userSubscription.findFirst({
				where: { library_slug: params.library, user_id: +params.id }
			});
			await user.update({
				where: { id: +params.id },
				data: { subscriptions: { delete: { id: subscription.id } } }
			});
		} catch (error) {
			console.log(error);
			return fail(400, { error: error.message });
		}
		throw redirect(302, `/${params.library}/members`);
	}
};
