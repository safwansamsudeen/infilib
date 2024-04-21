import { user } from '$lib/db';
import { getUserColumns } from '$lib/columns';

export async function load({ params }) {
	console.time('In');
	let library_slug = params.library;
	const columns = getUserColumns(library_slug);

	let users = user.findMany({
		where: { subscriptions: { some: { type: { library_slug } } } },
		include: { subscriptions: { include: { type: true } } },
		cacheStrategy: { swr: 60, ttl: 60 }
	});
	console.timeEnd('In');

	return {
		users,
		columns: [{ id: 'member_id', name: 'Member ID', important: true }, ...columns]
	};
}
