import { getItemColumns, getUserColumns } from '$lib/columns.js';
import { fail } from '@sveltejs/kit';

const PROPERTY_VALIDATORS = {
	select: (val, items) => items.some(({ value }) => value === val),
	// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
	email: (val) =>
		val
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			),
	// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
	number: (val) => !isNaN(val) && !isNaN(parseFloat(val)),
	isbn: (VAL) => 'TBD'
};

export function parseProperties(obj, columns) {
	console.log(columns);
	for (let { id, name, type, important, items } of columns) {
		console.log(id, obj[id]);
		if (important && !obj[id]) {
			return { name, missing: true };
		}
		try {
			if (['select', 'number'].includes(type)) {
				obj[id] = JSON.parse(obj[id] || '[]');
				if (type === 'select') {
					obj[id] = obj[id].value;
				}
			}
		} catch (error) {
			return { name, value: obj[id], incorrect: true };
		}
		if (!(PROPERTY_VALIDATORS[id] || ((val) => true))(obj[id], items)) {
			return { name, value: obj[id], incorrect: true };
		}
	}
}

export async function validateItemProperty(value, property, type) {
	let res = true;
	let columns = await getItemColumns(type, true);
}
