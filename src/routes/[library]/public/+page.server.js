import { item } from '$lib/db.js';

export async function load({ params }) {
	let books = item.findMany({
		where: { library: { slug: { equals: params.library } }, book: { isNot: null } },
		include: {
			publisher: true,
			categories: true,
			languages: true,
			book: { include: { authors: true } },
			mark: true
		}
	});
	return { books };
}
