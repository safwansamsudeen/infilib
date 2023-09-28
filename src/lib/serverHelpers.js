import { author, item, category, language, publisher, book, magazine } from '$lib/db.js';
import { capitalize, date } from '$lib/helpers.js';
import { fail, json } from '@sveltejs/kit';

export async function pojoData(request) {
	return Object.fromEntries(await request.formData());
}

export async function pojofyColumns(columns) {
	return columns?.map?.((column) => {
		delete column.get;
		delete column.getPlain;
		return column;
	});
}

export async function response(func, return_val) {
	try {
		let result = await func();
		if (return_val === true) {
			return result;
		}
		return return_val || { success: true };
	} catch (error) {
		console.log(error);
		return fail(500, {});
	}
}

export async function serverResponse(func, status_code = 200) {
	try {
		let result = await func();
		return new json({ success: true, status_code });
	} catch (error) {
		console.log(error);
		return new json({ success: false, status_code: 500, detail: error });
	}
}

export function parseData(data, keys) {
	keys.forEach((key) => {
		if (key in data) {
			data[key] = JSON.parse(data[key] || '[]');
		} else if (key.name in data) {
			if (key.type == 'date') {
				data[key.name] = new Date(data[key.name]);
			}
		}
	});
}

export async function columns(type) {
	const publishers = await publisher.findMany();
	const categories = await category.findMany();
	const languages = await language.findMany();
	let columns;
	if (type === 'item') {
		columns = [
			{ id: 'acc_no', name: 'Acc. No.', type: 'number', link: true, important: true },
			{ id: 'call_no', type: 'number', opts: { step: 0.01 }, important: true },
			{ id: 'title', important: true },
			{ id: 'status', important: true, type: 'hidden', opts: { value: 'IN' } },
			{
				id: 'publisher',
				type: 'select',
				items: publishers.map(({ id, name }) => ({
					value: id,
					label: name
				})),
				get: ({ id, name }) => ({
					value: id,
					label: name
				}),
				getPlain: ({ name }) => name,
				important: true
			},
			{
				id: 'languages',
				type: 'select',
				items: languages.map(({ code, name }) => ({ value: code, label: name + ', ' + code })),
				get: (languages) =>
					languages.map(({ code, name }) => ({ value: code, label: name + ', ' + code })),
				getPlain: (languages) => languages.map(({ code, name }) => name).join(', '),
				multiple: true,
				hidden: true
			},
			{
				id: 'categories',
				type: 'select',
				items: categories.map(({ id, name }) => ({ value: id, label: name })),
				get: (categories) => categories.map(({ id, name }) => ({ value: id, label: name })),
				getPlain: (categories) => categories.map(({ name }) => name).join(', '),
				multiple: true,
				hidden: true
			},
			{ id: 'no_of_pages', type: 'number', hidden: true },
			{ id: 'purchase_price', type: 'number', hidden: true, getPlain: (number) => String(number) },
			{ id: 'purchase_details', hidden: true },
			{ id: 'level', hidden: true },
			{ id: 'remarks', hidden: true, type: 'textarea' },
			{ id: 'reference', type: 'check', getPlain: (ref) => (ref ? 'Y' : 'N'), hidden: true }
		];
	} else if (type === 'book') {
		const authors = await author.findMany();
		columns = [
			{ id: 'subtitle', hidden: true, important: true },
			{
				id: 'authors',
				type: 'select',
				items: authors.map(({ id, name }) => ({ value: id, label: name })),
				get: (authors) => authors?.map(({ id, name }) => ({ value: id, label: name })),
				getPlain: (authors) => authors.map(({ name }) => name).join(', '),
				multiple: true,
				important: true
			},
			{ id: 'isbn', type: 'number', name: 'ISBN', important: true },
			{ id: 'publication_year', name: 'Year Published' },
			{ id: 'edition', hidden: true }
		];
	} else {
		columns = [
			{ id: 'issue', important: true },
			{ id: 'volume', important: true },
			{ id: 'sc_no', type: 'number', important: true },
			{ id: 'from', type: 'date', getPlain: date },
			{ id: 'to', type: 'date', getPlain: date }
		];
	}
	return columns.map(({ name, ...data }) => ({
		...data,
		name: name || capitalize(data.id)
	}));
}

export async function flattenItems(
	items,
	itemColumns,
	bookColumns,
	magazineColumns,
	type,
	getPlain = true
) {
	if (type === 'book') {
		return items.map(({ book, ...data }) => {
			let itemData, bookData;
			if (getPlain) {
				itemData = itemColumns
					// .filter(({ hidden }) => !hidden)
					.map(({ id, getPlain }) => (getPlain ? getPlain(data[id]) : data[id]));
				bookData = bookColumns
					// .filter(({ hidden }) => !hidden)
					.map(({ id, getPlain }) => (getPlain ? getPlain(book[id]) : book[id]));
			} else {
				itemData = itemColumns.map(({ id, get }) => [id, get ? get(data[id]) : data[id]]);
				bookData = bookColumns.map(({ id, get }) => [id, get ? get(book[id]) : book[id]]);
			}
			return getPlain ? itemData.concat(bookData) : Object.fromEntries(itemData.concat(bookData));
		});
	} else if (type === 'magazine') {
		return items.map(({ magazine, ...data }) => {
			let itemData = itemColumns
				// .filter(({ hidden }) => !hidden)
				.map(({ id, getPlain }) => (getPlain ? getPlain(data[id]) : data[id]));
			let magazineData = magazineColumns
				// .filter(({ hidden }) => !hidden)
				.map(({ id, getPlain }) => (getPlain ? getPlain(magazine[id]) : magazine[id]));
			return itemData.concat(magazineData);
		});
	}
	return items.map(({ book, magazine, ...data }) => {
		let itemData = itemColumns
			// .filter(({ hidden }) => !hidden)
			.map(({ id, getPlain }) => (getPlain ? getPlain(data[id]) : data[id]));
		return itemData;
	});
}

export async function parseItem(item_obj, create = true) {
	parseData(item_obj, [
		'publisher',
		'languages',
		'categories',
		'no_of_pages',
		'purchase_price',
		'authors',
		'publication_year',
		'acc_no',
		'sc_no',
		{ name: 'from', type: 'date' },
		{ name: 'to', type: 'date' }
	]);
	const type = item_obj.type;
	let tmp;
	let publisher_id,
		languages_id = [],
		categories_id = [],
		authors_id = [];
	let acc_no,
		title,
		publisher_obj,
		languages,
		categories,
		reference,
		call_no,
		no_of_pages,
		purchase_price,
		purchase_details,
		level,
		remarks,
		sc_no,
		volume,
		issue,
		from,
		to,
		subtitle,
		publication_year,
		authors,
		isbn,
		edition;
	if (type === 'book') {
		({
			acc_no,
			title,
			subtitle,
			publisher: publisher_obj,
			languages,
			categories,
			reference,
			call_no,
			no_of_pages,
			purchase_price,
			purchase_details,
			level,
			remarks,
			authors,
			isbn,
			publication_year,
			edition
		} = item_obj);

		for (let { value, label } of authors) {
			if (value === label) {
				tmp = await author.create({
					data: {
						name: label
					}
				});
				authors_id.push({ id: tmp.id });
			} else {
				authors_id.push({ id: value });
			}
		}
	} else {
		({
			acc_no,
			title,
			publisher: publisher_obj,
			languages,
			categories,
			reference,
			call_no,
			no_of_pages,
			purchase_price,
			purchase_details,
			level,
			remarks,
			sc_no,
			volume,
			issue,
			from,
			to
		} = item_obj);
	}
	if (publisher_obj.value === publisher_obj.label) {
		let [name, ...address] = publisher_obj.label.split(',');
		name = name.trim();
		address = address.join(', ').trim();
		tmp = await publisher.create({ data: { name, address } });
		publisher_id = tmp.id;
	} else {
		publisher_id = publisher_obj.value;
	}
	for (let { value, label } of languages) {
		if (value === label) {
			let [code, ...name] = label.split(',');
			name = name.join(',').trim();
			code = code.trim();
			tmp = await language.create({
				data: {
					code,
					name
				}
			});
			languages_id.push({ code: tmp.code });
		} else {
			languages_id.push({ code: value });
		}
	}
	console.log(languages_id);
	for (let { value, label } of categories) {
		if (value === label) {
			tmp = await category.create({
				data: {
					name: label
				}
			});
			categories_id.push({ id: tmp.id });
		} else {
			categories_id.push({ id: value });
		}
	}
	const commonData = {
		acc_no,
		title,
		publisher: { connect: { id: publisher_id } },
		languages: {
			set: languages_id
		},
		categories: {
			set: categories_id
		},
		reference: reference === 'on' ? true : false,
		call_no,
		no_of_pages,
		purchase_price,
		purchase_details,
		level,
		remarks,
		status: 'IN'
	};
	if (create) {
		if (type === 'book') {
			return item.create({
				data: {
					...commonData,
					book: {
						create: {
							authors: { connect: authors_id },
							subtitle,
							publication_year,
							edition,
							isbn
						}
					}
				}
			});
		} else {
			return item.create({
				data: {
					...commonData,
					magazine: {
						create: {
							from,
							to,
							sc_no,
							isbn,
							volume,
							issue
						}
					}
				}
			});
		}
	} else {
		if (type === 'book') {
			return item.update({
				where: {
					acc_no: acc_no
				},
				data: {
					...commonData,
					book: {
						update: {
							authors: { set: authors_id },
							subtitle,
							publication_year,
							edition,
							isbn
						}
					}
				}
			});
		} else {
			return item.update({
				where: {
					acc_no: acc_no
				},
				data: {
					...commonData,
					magazine: {
						update: {
							from,
							to,
							sc_no,
							isbn,
							volume,
							issue
						}
					}
				}
			});
		}
	}
}
