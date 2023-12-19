import { date } from '$lib/helpers.js';

const PROPERTY_VALIDATORS = {
	// TODO: improve
	select: (val, opts) => 'TBD',
	// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
	email: (val) =>
		val
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			),
	// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
	number: (val) => !isNaN(val) && !isNaN(parseFloat(val)),
	checkbox: (val) => ['on', undefined].includes(val),
	isbn: (val) => 'TBD',
	tel: (val) => 'TBD'
};

export function validateAndClean(obj, columns, action = 'create') {
	for (let { id: columnId, name, type, important, opts, columns: subColumns } of columns) {
		console.log(columnId);
		if (type === 'object') {
			let subObj = {};
			for (let { id: subId } of subColumns) {
				subObj[subId] = obj[subId];
				delete obj[subId];
			}
			let check = validateAndClean(subObj, subColumns);
			if (check) return check;
			obj[columnId] = { [action]: subObj };
		}

		if (important && !obj[columnId] && type !== 'checkbox') {
			return { name, missing: true };
		}
		if (!important && obj[columnId]?.length === 0) {
			obj[columnId] = undefined;
			continue;
		}
		try {
			if (['select', 'number'].includes(type)) {
				obj[columnId] = JSON.parse(obj[columnId] || '[]');
			}
			if (!(PROPERTY_VALIDATORS[type] || (() => true))(obj[columnId], opts)) {
				return { name, value: obj[columnId], incorrect: true };
			}
			if (type === 'select') {
				const itemId = opts.itemId || 'id';
				const label = opts.label || 'name';
				if (opts.creatable !== false) {
					if (opts.multiple) {
						obj[columnId] = {
							connectOrCreate: obj[columnId].map(({ [label]: name }) => {
								return {
									where: {
										[label]: name
									},
									create: {
										[label]: name
									}
								};
							})
						};
					} else {
						const { [label]: name } = obj[columnId];

						obj[columnId] = {
							connectOrCreate: {
								where: {
									[label]: name
								},
								create: {
									[label]: name
								}
							}
						};
					}
				} else {
					if (Array.isArray(obj[columnId])) {
						obj[columnId] = {
							connect: obj[columnId].map(({ [itemId]: id, [label]: name }) => {
								return {
									[itemId]: id || 0,
									[label]: name
								};
							})
						};
					} else {
						const { [itemId]: id, [label]: name } = obj[columnId];

						obj[columnId] = {
							connect: {
								[itemId]: id || 0,
								[label]: name
							}
						};
					}
				}
			}
			if (type === 'checkbox') {
				obj[columnId] = obj[columnId] === 'on';
			}
			if (type === 'date') {
				obj[columnId] = date(obj[columnId], false);
			}
		} catch (error) {
			console.log(error);
			return { name, value: obj[columnId], incorrect: true, error: error.message };
		}
	}
}
