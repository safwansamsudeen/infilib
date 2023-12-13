import { item } from '$lib/db.js';
import { getItemColumns } from '$lib/columns.js';
import { prettify, flatten } from '$lib/helpers.js';

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
	const [columns, others] = await getItemColumns(params.library);
	flatten(books, 'book');
	await prettify(books, columns.concat(others.book));
	return { books };
}
