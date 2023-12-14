import { item } from '$lib/db.js';
import { getBookColumns, getItemColumns } from '$lib/columns.js';
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
	const itemColumns = await getItemColumns(params.library);
	const bookColumns = await getBookColumns(params.library);
	flatten(books, 'book');
	await prettify(books, itemColumns.concat(bookColumns));
	return { books };
}
