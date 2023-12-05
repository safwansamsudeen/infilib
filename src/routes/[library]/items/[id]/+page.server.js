import { item, transaction } from '$lib/db.js';
import { findOr404, pojoData, response } from '$lib/serverHelpers.js';
import { fail, redirect } from '@sveltejs/kit';
import { standardize, injectLibraryInSelect } from '$lib/helpers.js';
import { getItemColumns, getTransColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';

function flatten(records, type) {
	records.map((rec) => Object.entries(rec[type]).map(([key, value]) => (rec[key] = value)));
}

export async function load({ params }) {
	let item_obj = await findOr404(item, {
		where: { id: +params.id },
		include: {
			book: { include: { authors: true } },
			magazine: true,
			publisher: true,
			categories: true,
			languages: true
		}
	});
	const transColumns = (await getTransColumns(params.library)).filter(({ id }) => id !== 'item');

	const [columns, otherColumns] = await getItemColumns(params.library);

	// Find type of item
	let type;
	Object.keys(otherColumns).map((id) => (item_obj[id] ? (type = id) : null));
	flatten([item_obj], type);

	const transactions = await transaction.findMany({
		where: { item_id: +params.id },
		include: { user: true }
	});

	standardize(transactions, transColumns);
	standardize([item_obj], columns.concat(otherColumns[type]), 'YYYY-MM-DD');
	return {
		item: item_obj,
		transactions,
		itemColumns: columns.map(({ opts, ...data }) => ({
			...data,
			opts: { ...opts, value: item_obj[data.id], disabled: data.id === 'id' }
		})),
		otherColumns: {
			[type]: otherColumns[type].map(({ opts, ...data }) => ({
				...data,
				opts: { ...opts, value: item_obj[data.id] }
			}))
		},
		transColumns,
		type
	};
}

export const actions = {
	update: async ({ request, params }) => {
		return await response(async () => {
			let requestData = await pojoData(request);
			const itemType = requestData.type;
			let [columns, others] = await getItemColumns(params.library);
			// Ensure DB ID doesn't get updated
			columns = columns.filter(({ id }) => id !== 'id');
			const joinedColumns = columns.concat(others[itemType]);
			let check = parseProperties(requestData, joinedColumns);
			if (check) return new fail(400, check);
			let data = {};
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
			data[itemType] = { update: shootOff };
			await item.update({ where: { id: +params.id }, data });
		}, true);
	},
	delete: async ({ params }) => {
		await response(async () => {
			await item.delete({ where: { id: +params.id } });
		});
		throw redirect(301, `/${params.library}/items`);
	}
};
