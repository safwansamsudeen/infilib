import { item } from '$lib/db.js';
import { flatten } from '$lib/helpers.js';

export async function load({ params }) {
	let books = await item.findMany({
		where: { library: { slug: { equals: params.library } }, book: { isNot: null } },
		include: {
			publisher: true,
			categories: true,
			languages: true,
			book: { include: { authors: true } },
			mark: true
		}
	});
	flatten(books, 'book');
	return { books };
}
