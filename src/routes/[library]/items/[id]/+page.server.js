import { item, transaction } from '$lib/db.js';
import { pojoData, response } from '$lib/serverHelpers.js';
import { fail, redirect } from '@sveltejs/kit';
import { standardizeSelects } from '$lib/helpers.js';
import { getItemColumns, getTransColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';

function flatten(records, type) {
	records.map((rec) => Object.entries(rec[type]).map(([key, value]) => (rec[key] = value)));
}

export async function load({ params }) {
	let item_obj = await item.findUnique({
		where: { id: +params.id },
		include: {
			book: { include: { authors: true } },
			magazine: true,
			publisher: true,
			categories: true,
			languages: true
		}
	});
	const transColumns = (await getTransColumns()).filter(({ id }) => id !== 'item');
	const [columns, others] = await getItemColumns();

	let type;
	Object.keys(others).map((id) => (item_obj[id] ? (type = id) : null));
	flatten([item_obj], type);
	const transactions = await transaction.findMany({
		where: { item_id: +params.id },
		include: { user: true }
	});

	standardizeSelects(transactions, transColumns);
	standardizeSelects([item_obj], columns.concat(others[type]), 'YYYY-MM-DD');
	return {
		item: item_obj,
		transactions,
		columns: columns.map(({ opts, ...data }) => ({
			...data,
			opts: { ...opts, value: item_obj[data.id], disabled: data.id === 'id' }
		})),
		inputColumns: {
			[type]: others[type].map(({ opts, ...data }) => ({
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
			const type = requestData.type;
			let [columns, others] = await getItemColumns();
			// Ensure DB ID doesn't get updated
			columns = columns.filter(({ id }) => id !== 'id');
			const joinedColumns = columns.concat(others[type]);
			let check = parseProperties(requestData, joinedColumns);
			if (check) return new fail(400, check);
			let data = {};
			for (let { id } of columns) data[id] = requestData[id];
			let shootOff = {};
			for (let { id } of others[type]) shootOff[id] = requestData[id];
			data[type] = { update: shootOff };
			await item.update({ where: { id: +params.id }, data });
		}, true);
	},
	delete: async ({ params }) => {
		return await response(async () => {
			await item.delete({ where: { acc_no: +params.id } });
			throw redirect(301, '/items');
		});
	}
};
