import { item, settings } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import { getBookColumns, getMagazineColumns, getItemColumns } from '$lib/columns.js';
import { flatten, injectLibraryInSelect, pojoData, response } from '$lib/helpers.js';
import { validateAndClean } from '$lib/validators.js';
import dayjs from 'dayjs';
import { URLSearchParams } from 'url';



export async function load({
	url,
	params,
	locals: {
		library: { settings }
	}
}) {
	const library_slug = params.library;
	let columns = getItemColumns(library_slug)
	return {
		columns,
		items: (async () => {
			// Set up DB params for modification
			let where = { library_slug };
			let include = {
				publisher: true,
				categories: true,
				book: { include: { authors: true } },
				magazine: true
			};

			// If there's a type specified, add columns and change DB call
			let type = url.searchParams.get('show');
			if ('show' && ['book', 'magazine'].includes(type)) {
				const otherColumns = (type === 'book' ? getBookColumns : getMagazineColumns)();
				where[type] = { ...where[type], isNot: null };
				columns = columns.concat(otherColumns);
			}

			const filters = getFilters(url.searchParams.entries());

			let items, newItems, popularItems, searchResults, filterResults;
			let shortcutResults = {};
			const search = url.searchParams.get('search');
			const searchResultsGiven = url.searchParams.get('search-results');

			if (url.searchParams.get('all') === 'true') {
				items = await item.findMany({
					include,
					where,
					cacheStrategy: { swr: 60, ttl: 60 },
					orderBy: {
						acc_no: 'asc'
					}
				});
				if (type) flatten(items, type);
			} else if (Object.keys(filters).length) {
				filterResults = await item.findMany({
					where: {
						...where,
						...filters
					},
					include
				});
				if (type) flatten(filterResults, type);
			} else if (search) {
				searchResults = await item.findMany({
					take: 3,
					include,
					where: {
						...where,
						OR: [
							{ title: { contains: search, mode: 'insensitive' } },
							{
								book: {
									OR: [
										{ subtitle: { contains: search, mode: 'insensitive' } },
										{ isbn: { contains: search, mode: 'insensitive' } },
										{ authors: { some: { name: { contains: search, mode: 'insensitive' } } } }
									]
								}
							},
							{ categories: { some: { name: { contains: search, mode: 'insensitive' } } } },
							{ publisher: { name: { contains: search, mode: 'insensitive' } } }
						]
					}
				});
				if (type) flatten(searchResults, type);
			} else if (searchResultsGiven) {
				searchResults = await item.findMany({
					include,
					where: {
						...where,
						id: { in: searchResultsGiven.split(',').map(Number) }
					}
				});
				if (type) flatten(searchResults, type);
			} else {
				for (let shortcut of settings.item_shortcuts) {
					let [name, shortcutStr] = shortcut.split('/');
					shortcutResults[name] = await item.findMany({
						where: {
							...where,
							...getFilters(new URLSearchParams(shortcutStr).entries())
						},
						include
					});
					if (type) flatten(shortcutResults[name], type);
				}
				newItems = await item.findMany({
					take: 25,
					include,
					where,
					orderBy: {
						purchased_on: {
							sort: 'desc'
						}
					},
					cacheStrategy: { swr: 60, ttl: 60 }
				});
				popularItems = await item.findMany({
					take: 25,
					include: {
						...include,
						transactions: true
					},
					where,
					orderBy: {
						transactions: {
							_count: 'desc'
						}
					},
					cacheStrategy: { swr: 60, ttl: 60 }
				});

				if (type) {
					flatten(newItems, type);
					flatten(popularItems, type);
				}
			}

			return {
				items,
				newItems,
				popularItems,
				searchResults,
				filterResults,
				shortcutResults
			};
		})()
	};
}

export const actions = {
	create: async function ({ request, params }) {
		return response(async () => {
			let requestData = await pojoData(request);
			delete requestData['id'];
			const itemType = requestData.type;
			const [columns, others] = await getItemColumns(params.library);
			const joinedColumns = columns.concat(others[itemType]);

			let check = validateAndClean(requestData, joinedColumns);
			if (check) return new fail(400, check);

			let data = { library: { connect: { slug: params.library } } };
			for (let { id, type } of columns)
				data[id] =
					type === 'select'
						? injectLibraryInSelect(requestData[id], params.library)
						: requestData[id];
			let shootOff = {};
			for (let { id, type } of others[itemType]) {
				shootOff[id] =
					type === 'select'
						? injectLibraryInSelect(requestData[id], params.library)
						: requestData[id];
			}
			data[itemType] = { create: shootOff };
			await item.create({ data });
		}, true);
	},
	goto: async function ({ request, params }) {
		let { data } = await pojoData(request);
		let item_obj;

		if (data.startsWith('978') || data.length >= 10) {
			item_obj = await item.findFirst({ where: { book: { isbn: data } } });
		} else {
			item_obj = await item.findFirst({ where: { acc_no: +data } });
		}
		console.log(item_obj)
		if (!item_obj) {
			return fail(404, { message: "Doesn't exist" });
		}
		redirect(303, `/${params.library}/items/${item_obj.id}`);
	},
	saveShortcut: async function ({
		request,
		locals: {
			library: { settings: _settings }
		}
	}) {
		let { search_str, name } = await pojoData(request);
		await settings.update({
			where: { id: _settings.id },
			data: { item_shortcuts: [..._settings.item_shortcuts, name + '/' + search_str.slice(1)] }
		});
	}
};

function getFilters(paramEntries) {
	let filters = {};
	for (let [key, val] of paramEntries) {
		const ids = val.split(',').map(Number);
		if (key === 'publisher') {
			filters.publisher_id = ids[0];
		} else if (key === 'languages' || key === 'categories') {
			filters[key] = { some: { id: { in: ids } } };
		} else if (key === 'authors') {
			filters.book = { ...where.book, authors: { some: { id: { in: ids } } } };
		} else {
			// Numeric fields
			const [min, max] = ids;
			if (['price', 'no_of_pages', 'call_no', 'acc_no'].includes(key)) {
				filters[key] = { gte: min, lte: max };
			} else if (key === 'publication_year') {
				filters.book = { ...where.book, [key]: { gte: min, lte: max } };
			} else if (key === 'sc_no') {
				filters.magazine = { ...where.magazine, [key]: { gte: min, lte: max } };
			} else {
				// Date fields
				const [min, max] = val.split(',').map((d) => dayjs(d, 'YYYY-MM-DD').toDate());
				if (['purchased_on'].includes(key)) {
					filters[key] = { gte: min, lte: max };
				} else if (['from', 'to'].includes(key)) {
					filters.magazine = { ...where.magazine, [key]: { gte: min, lte: max } };
				}
			}
		}
	}
	return filters;
}