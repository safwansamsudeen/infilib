import { transaction, user, userSubscription } from '$lib/db.js';
import { date, standardize } from '$lib/helpers.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { validateAndClean } from '$lib/validators.js';
import { fail, redirect } from '@sveltejs/kit';
import { getTransColumns, getUserColumns } from '$lib/columns.js';

function addDefaults(obj, { opts, ...data }) {
	if (data.type !== 'object') {
		return {
			...data,
			opts: {
				...opts,
				value: obj[data.id]
			}
		};
	} else {
		return {
			...data,
			columns: data.columns.map((col) => addDefaults(obj[data.id], col))
		};
	}
}

export async function load({ params }) {
	let user_obj = await user.findUnique({
		where: {
			id: +params.id,
			subscriptions: { some: { type: { library_slug: params.library } } }
		},
		include: { subscriptions: { include: { type: true } } }
	});
	// Do member specific stuff
	const subscription = user_obj.subscriptions.find(
		({ type }) => type.library_slug === params.library
	);
	user_obj = {
		...user_obj,
		gender: { value: user_obj.gender, label: user_obj.gender === 'M' ? 'Male' : 'Female' },
		subscription: {
			...subscription,
			type: { value: subscription.type.id, label: subscription.type.name }
		}
	};

	const transColumns = (await getTransColumns(params.library)).filter(({ id }) => id !== 'user');
	const userColumns = await getUserColumns(params.library, true);

	const transactions = await transaction.findMany({
		where: {
			user_id: +params.id
		},
		include: { item: true }
	});

	standardize(transactions, transColumns);
	console.log(transactions);

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

		const userColumns = await getUserColumns(params.library);
		let check = validateAndClean(requestData, userColumns);
		if (check) return check;

		// Modifications specific to User model
		requestData.gender = requestData.gender.connect.value;
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
