import { borrowable, publisher, author, category, language } from '$lib/db.js';
import { pojoData, parseData } from '$lib/helpers.js';
import { fail } from '@sveltejs/kit';

export async function load() {
	let borrowables = await borrowable.findMany({
		include: {
			publisher: true,
			book: {
				include: { authors: true }
			},
			magazine: true,
			categories: true,
			languages: true
		}
	});
	const publishers = await publisher.findMany();
	const authors = await author.findMany();
	const categories = await category.findMany();
	const languages = await language.findMany();

	borrowables = borrowables.map(
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
		}) => [
			acc_no,
			title,
			book.subtitle,
			call_no,
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
			reference,
			level,
			remarks
		]
	);
	let columns = [
		{ name: 'acc_no', label: 'Acc. No.', type: 'number' },
		{ name: 'title' },
		{ name: 'subtitle' },
		{ name: 'call_no', type: 'number', opts: { step: 0.01 } },
		{
			name: 'authors',
			type: 'custom-select',
			values: authors.map(({ id, name }) => ({ value: id, label: name }))
		},
		{ name: 'isbn', type: 'number', label: 'ISBN' },
		{
			name: 'publisher',
			type: 'custom-select',
			values: publishers.map(({ id, name, address }) => ({
				value: id,
				label: name + ',\n' + address
			}))
		},
		{ name: 'publication_year', label: 'Year of Publication' },
		{
			name: 'languages',
			type: 'custom-select',
			values: languages.map(({ code, name }) => ({ value: code, label: name + ', ' + code }))
		},
		{
			name: 'categories',
			type: 'custom-select',
			values: categories.map(({ id, name }) => ({ value: id, label: name }))
		},
		{ name: 'edition' },
		{ name: 'no_of_pages', type: 'number' },
		{ name: 'purchase_price', type: 'number' },
		{ name: 'purchase_details' },
		{ name: 'reference', type: 'check' },
		{ name: 'level' },
		{ name: 'remarks' }
	];
	return {
		columns,
		borrowables,
		authors: authors.map(({ id, name }) => ({ value: id, label: name })),
		categories: categories.map(({ id, name }) => ({ value: id, label: name })),
		languages: languages.map(({ code, name }) => ({ value: code, label: name + ', ' + code })),
		publishers: publishers.map(({ id, name, address }) => ({
			value: id,
			label: name + ',\n' + address
		}))
	};
}

export const actions = {
	create: async function ({ request }) {
		try {
			const data = await pojoData(request);
			console.log(data);
			parseData(data, [
				'publisher_obj',
				'languages',
				'categories',
				'no_of_pages',
				'purchase_price',
				'authors',
				'publication_year',
				'acc_no'
			]);
			console.log(data);
			const {
				acc_no,
				title,
				subtitle,
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
				authors,
				isbn,
				publication_year,
				edition
			} = data;
			let tmp;
			let publisher_id,
				languages_id = [],
				categories_id = [],
				authors_id = [];
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
			console.log(publisher_id, languages_id, categories_id, authors_id);
			await borrowable.create({
				data: {
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
					status: 'IN',
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
		} catch (e) {
			console.log(e);
			return fail(500, {});
		}
	}
};
