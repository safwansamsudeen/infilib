import { user, item, transaction } from '$lib/db.js';

export async function load({ params }) {
	return {
		items: await item.findMany({
			where: { library_slug: params.library },
			include: { book: { include: { authors: true } }, magazine: true }
		}),
		transactions: await transaction.findMany({ where: { item: { library_slug: params.library } } }),
		users: await user.findMany({
			where: { subscriptions: { some: { type: { library_slug: params.library } } } },
			include: { subscriptions: { include: { type: true } } }
		})
	};
}
