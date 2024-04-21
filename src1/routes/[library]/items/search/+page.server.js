import { getSearchColumns } from '$lib/columns';
import { pojoData } from '$lib/serverHelpers';
import { item } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export function load() {
	return { searchColumns: getSearchColumns() };
}

export const actions = {
	search: async function ({ request, params: { library: library_slug } }) {
		const {
			categories,
			title,
			isbn,
			authors,
			publisher,
			call_no,
			year_published,
			purchase_details
		} = await pojoData(request);

		const searchResults = await item.findMany({
			select: { id: true },
			where: {
				library_slug,
				OR: [
					{ title: { contains: title || undefined, mode: 'insensitive' } },
					{ purchase_details: { contains: purchase_details || undefined, mode: 'insensitive' } },
					{ call_no: { equals: +call_no || undefined } },
					(isbn || year_published || title || authors) && {
						book: {
							OR: [
								{ publication_year: { equals: +year_published || undefined } },
								{ subtitle: { contains: title || undefined, mode: 'insensitive' } },
								{ isbn: { contains: isbn || undefined, mode: 'insensitive' } },
								authors && {
									authors: {
										some: { name: { contains: authors || undefined, mode: 'insensitive' } }
									}
								}
							].filter((obj) => obj)
						}
					},
					isbn && {
						magazine: {
							issn: { contains: isbn || undefined, mode: 'insensitive' }
						}
					},
					categories && {
						categories: {
							some: { name: { contains: categories || undefined, mode: 'insensitive' } }
						}
					},
					publisher && {
						publisher: { name: { contains: publisher || undefined, mode: 'insensitive' } }
					}
				].filter((obj) => obj)
			}
		});

		redirect(
			303,
			`/${library_slug}/items/?search-results=${searchResults.map(({ id }) => id).join(',')}`
		);
	}
};
