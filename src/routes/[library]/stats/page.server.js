// import { user, item, transaction } from '$lib/db.js';

export function load({ params }) {
	return { a: 2 };
	// return {
	// 	items: await item.findMany({
	// 		where: { library_slug: params.library }
	// 	}),
	// 	transactions: await transaction.findMany({ where: { item: { library_slug: params.library } } }),
	// 	users: await user.findMany({
	// 		where: { subscriptions: { some: { type: { library_slug: params.library } } } }
	// 	})
	// };
}