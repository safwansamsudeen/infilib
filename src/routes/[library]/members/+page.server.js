import { user } from '$lib/db.js';
import { getUserColumns } from '$lib/columns.js';
import { date } from '$lib/helpers.js';

export async function load({ params }) {
	let library_slug = params.library;

	return {
		streamed: {
			users: (async () => {
				const columns = await getUserColumns(library_slug);

				let users = await user.findMany({
					where: { subscriptions: { some: { type: { library_slug } } } },
					include: { subscriptions: { include: { type: true } } },
					cacheStrategy: { swr: 60, ttl: 60 }
				});

				// Select the one subscription of this library, clean date, add member ID
				users = users.map(({ subscriptions, date_of_birth, ...user_obj }) => {
					const subscription = subscriptions.find(({ type }) => type.library_slug === library_slug);
					return {
						...user_obj,
						member_id: subscription.member_id,
						date_of_birth: date(date_of_birth),
						subscription: subscription.type.name
					};
				});

				return {
					users,
					columns: [{ id: 'member_id', name: 'Member ID', important: true }, ...columns]
				};
			})()
		}
	};
}
