const PROPERTY_VALIDATORS = {
	select: (val, opts) =>
		opts.creatable !== false || opts.items.some(({ value }) => value === val.value),
	// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
	email: (val) =>
		val
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			),
	// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
	number: (val) => !isNaN(val) && !isNaN(parseFloat(val)),
	checkbox: (val) => ['on', undefined, true, false].includes(val),
	isbn: (VAL) => 'TBD'
};

export function parseProperties(obj, columns, clean = false) {
	for (let { id, name, type, important, opts } of columns) {
		if (important && obj[id] === null) {
			return { name, missing: true };
		}
		if (!important && obj[id]?.length === 0) {
			obj[id] = undefined;
			continue;
		}
		try {
			if (!clean && ['select', 'number'].includes(type)) {
				obj[id] = JSON.parse(obj[id] || '[]');
			}
			if (!(PROPERTY_VALIDATORS[type] || (() => true))(obj[id], opts)) {
				return { name, value: obj[id], incorrect: true };
			}
			if (type === 'select') {
				if (opts.creatable !== false) {
					if (opts.multiple) {
						obj[id] = {
							connectOrCreate: obj[id].map(({ label }) => {
								return {
									where: {
										[opts.unpacking.label]: label
									},
									create: {
										[opts.unpacking.label]: label
									}
								};
							})
						};
					} else {
						const { label } = obj[id];

						obj[id] = {
							connectOrCreate: {
								where: {
									[opts.unpacking.label]: label
								},
								create: {
									[opts.unpacking.label]: label
								}
							}
						};
					}
				} else {
					if (Array.isArray(obj[id])) {
						obj[id] = {
							connect: obj[id].map(({ value, label }) => {
								return {
									[opts.unpacking.value]: value || 0,
									[opts.unpacking.label]: label
								};
							})
						};
					} else {
						const { value, label } = obj[id];

						obj[id] = {
							connect: {
								[opts.unpacking.value]: value || 0,
								[opts.unpacking.label]: label
							}
						};
					}
				}
			}
			if (!clean && type === 'checkbox') {
				obj[id] = obj[id] === 'on';
			}
			if (!clean && type === 'date') {
				obj[id] = new Date(obj[id]);
			}
		} catch (error) {
			return { name, value: obj[id], incorrect: true, error: error.message };
		}
	}
}
