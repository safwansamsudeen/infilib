import { item } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { fail } from '@sveltejs/kit';
import { getBookColumns, getMagazineColumns, getItemColumns } from '$lib/columns.js';
import { prettify, flatten, injectLibraryInSelect } from '$lib/helpers.js';
import { validateAndClean } from '$lib/validators.js';

export async function load({ url, params }) {
	const library_slug = params.library;
	return {
		streamed: {
			items: new Promise(async (res) => {
				let columns = await getItemColumns(library_slug);

				// Set up DB params for modification
				let where = { library_slug };
				let include = {
					publisher: true,
					categories: true,
					languages: true
				};

				// If there's a type specified, add columns and change DB call
				let type;
				for (let [key, val] of url.searchParams.entries()) {
					if (key === 'show' && ['book', 'magazine'].includes(val)) {
						type = val;
						const otherColumns = await (type === 'book' ? getBookColumns : getMagazineColumns)();
						where[val] = { isNot: null };
						include[val] = {
							include: Object.fromEntries(
								otherColumns.filter(({ type }) => type === 'select').map(({ id }) => [id, true])
							)
						};
						columns = columns.concat(otherColumns);
						break;
					}
				}
				let items = await item.findMany({ include, where, cacheStrategy: { swr: 60, ttl: 60 } });

				// Flatten and standardize items
				if (type) flatten(items, type);
				prettify(items, columns);

				res({
					items,
					columns
				});
			})
		}
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
	}
};
