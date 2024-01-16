import { transaction, user, userSubscription } from '$lib/db.js';
import { addDefaults, getUserSubscription, prettify } from '$lib/helpers.js';
import { findOr404, pojoData, response } from '$lib/serverHelpers.js';
import { validateAndClean } from '$lib/validators.js';
import { redirect } from '@sveltejs/kit';
import { getTransColumns, getUserColumns } from '$lib/columns.js';

export async function load({ params }) {
	let user_obj = await findOr404(user, {
		where: {
			id: +params.id,
			subscriptions: { some: { type: { library_slug: params.library } } }
		},
		include: { subscriptions: { include: { type: true } } }
	});

	// Do member specific stuff
	const subscription = getUserSubscription(user_obj, params.library);
	user_obj = {
		...user_obj,
		gender: { id: user_obj.gender, name: user_obj.gender === 'M' ? 'Male' : 'Female' },
		subscription: {
			...subscription,
			type: { id: subscription.type.id, name: subscription.type.name }
		}
	};

	const transColumns = (await getTransColumns(params.library)).filter(({ id }) => id !== 'user');
	const userColumns = await getUserColumns(params.library, true);

	const transactions = await transaction.findMany({
		where: {
			user_id: +params.id
		},
		include: { item: true, subscription: true }
	});

	prettify(transactions, transColumns);

	return {
		user: user_obj,
		transactions,
		userColumns: userColumns.map((col) => addDefaults(user_obj, col)),
		transColumns
	};
}

export const actions = {
	update: async ({ request, params }) => {
		const requestData = await pojoData(request);

		const userColumns = await getUserColumns();
		let check = validateAndClean(requestData, userColumns);
		if (check) return check;

		// Modifications specific to User model
		requestData.gender = requestData.gender.connect.id;
		// delete requestData.subscription.create
		requestData.subscriptions = {
			update: {
				where: {
					type_id_user_id: {
						type_id: requestData.subscription.create.type.connect.id,
						user_id: +params.id
					}
				},
				data: requestData.subscription.create
			}
		};
		delete requestData.subscription;
		return response(async () => {
			await user.update({
				where: { id: +params.id },
				data: requestData
			});
		});
	},
	delete: async ({ params }) => {
		const res = await response(async () => {
			const subscription = await userSubscription.findFirst({
				where: { type: { library_slug: params.library }, user_id: +params.id }
			});
			await user.update({
				where: { id: +params.id },
				data: { subscriptions: { delete: { id: subscription.id } } }
			});
		}, true);
		if (res) throw res;
		throw redirect(302, `/${params.library}/members`);
	}
};
