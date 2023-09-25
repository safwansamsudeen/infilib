import { author, borrowable, category, language, publisher, book, magazine } from '$lib/db.js';
import { capitalize } from '$lib/helpers.js';
import { fail } from '@sveltejs/kit';
import dayjs from 'dayjs';

export async function pojoData(request) {
	return Object.fromEntries(await request.formData());
}

export async function response(func, return_val = { success: true }) {
	try {
		await func();
		return return_val;
	} catch (error) {
		console.log(error);
		return fail(500, {});
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

export async function borrowableColumns(type) {
	const publishers = await publisher.findMany();
	const categories = await category.findMany();
	const languages = await language.findMany();
	let columns;
	if (type === 'borrowable') {
		columns = [
			{ id: 'acc_no', name: 'Acc. No.', type: 'number', link: true, important: true },
			{ id: 'call_no', type: 'number', opts: { step: 0.01 }, important: true },
			{ id: 'title', important: true },
			{ id: 'status', important: true },
			{
				id: 'publisher',
				type: 'select',
				items: publishers.map(({ id, name }) => ({
					value: id,
					label: name
				}))
			},
			{
				id: 'languages',
				type: 'select',
				items: languages.map(({ code, name }) => ({ value: code, label: name + ', ' + code })),
				multiple: true,
				hidden: true
			},
			{
				id: 'categories',
				type: 'select',
				items: categories.map(({ id, name }) => ({ value: id, label: name })),
				multiple: true,
				hidden: true
			},
			{ id: 'no_of_pages', type: 'number', hidden: true },
			{ id: 'purchase_price', type: 'number', hidden: true },
			{ id: 'purchase_details', hidden: true },
			{ id: 'level', hidden: true },
			{ id: 'remarks', hidden: true },
			{ id: 'reference', type: 'check' }
		];
	} else if (type === 'book') {
		const authors = await author.findMany();
		columns = [
			{ id: 'subtitle', hidden: true, important: true },
			{
				id: 'authors',
				type: 'select',
				items: authors.map(({ id, name }) => ({ value: id, label: name })),
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
			{ id: 'from', type: 'date' },
			{ id: 'to', type: 'date' }
		];
	}
	return columns.map(({ name, ...data }) => ({
		...data,
		name: name || capitalize(data.id)
	}));
}

export function flattenBorrowables(borrowables, dict = false) {
	return borrowables.map(
		({
			acc_no,
			title,
			status,
			publisher,
			languages,
			categories,
			reference,
			call_no,
			no_of_pages,
			purchase_price,
			purchase_details,
			level,
			remarks,
			book,
			magazine
		}) => {
			if (book) {
				if (dict) {
					return {
						acc_no,
						call_no,
						title,
						subtitle: book.subtitle,
						authors: book.authors.map(({ id, name }) => ({ value: id, label: name })),
						status,
						isbn: book.isbn,
						publisher: {
							value: publisher.id,
							label: publisher.name
						},
						publication_year: book.publication_year,
						languages: languages.map(({ code, name }) => ({
							value: code,
							label: name + ', ' + code
						})),
						categories: categories.map(({ id, name }) => ({ value: id, label: name })),
						edition: book.edition,
						no_of_pages,
						purchase_price,
						purchase_details,
						level,
						remarks,
						reference
					};
				}
				return [
					acc_no,
					call_no,
					title,
					book.subtitle,
					book.authors.map((obj) => obj.name).join(', '),
					status,
					book.isbn,
					publisher.name,
					book.publication_year,
					languages.map((obj) => obj.name).join(', '),
					categories.map((obj) => obj.name).join(', '),
					book.edition,
					no_of_pages,
					purchase_price,
					purchase_details,
					level,
					remarks,
					reference
				];
			} else {
				if (dict) {
					return {
						acc_no,
						call_no,
						title,
						issue: magazine.issue,
						volume: magazine.volume,
						status,
						sc_no: magazine.sc_no,
						publisher: {
							value: publisher.id,
							label: publisher.name
						},
						languages: languages.map(({ code, name }) => ({
							value: code,
							label: name + ', ' + code
						})),
						categories: categories.map(({ id, name }) => ({ value: id, label: name })),
						from: dayjs(magazine.from).format('YYYY-MM-DD'),
						to: dayjs(magazine.to).format('YYYY-MM-DD'),
						no_of_pages,
						purchase_price,
						purchase_details,
						reference,
						level,
						remarks
					};
				}
				return [
					acc_no,
					call_no,
					title,
					magazine.issue,
					magazine.volume,
					status,
					magazine.sc_no,
					publisher.name,
					languages.map((obj) => obj.name).join(', '),
					categories.map((obj) => obj.name).join(', '),
					magazine.from.toDateString(),
					magazine.to.toDateString(),
					no_of_pages,
					purchase_price,
					purchase_details,
					reference,
					level,
					remarks
				];
			}
		}
	);
}

export async function parseBorrowable(borrowable_obj, create = true) {
	parseData(borrowable_obj, [
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
	const type = borrowable_obj.type;
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
		} = borrowable_obj);

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
		} = borrowable_obj);
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
			connect: languages_id
		},
		categories: {
			connect: categories_id
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
			return borrowable.create({
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
			return borrowable.create({
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
			return borrowable.update({
				where: {
					acc_no: acc_no
				},
				data: {
					...commonData,
					book: {
						update: {
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
			return borrowable.update({
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
