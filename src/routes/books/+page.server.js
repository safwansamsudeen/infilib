import { borrowable, publisher, author, category, language } from '$lib/db.js';
import { pojoData, parseData, listifyData } from '$lib/helpers.js';

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
	const columns = [
		{ name: 'acc_no', label: 'Acc. No.', type: 'number' },
		{ name: 'title' },
		{ name: 'subtitle' },
		{ name: 'call_no' },
		{ name: 'authors' },
		{ name: 'status' },
		{ name: 'isbn' },
		{ name: 'publisher' },
		{ name: 'publication_year' },
		{ name: 'languages' },
		{ name: 'categories' },
		{ name: 'edition' },
		{ name: 'no_of_pages' },
		{ name: 'purchase_price' },
		{ name: 'purchase_details' },
		{ name: 'reference' },
		{ name: 'level' },
		{ name: 'remarks' }
	];
	console.log(borrowables[0]);
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
	return {
		columns,
		borrowables,
		authors,
		categories,
		languages,
		publishers: publishers.map(({ id, name, address }) => ({
			id,
			name: name + '\n' + address
		}))
	};
}

export const actions = {
	create: async function ({ request }) {
		const data = await pojoData(request);
		console.log(data);
		parseData(data, [
			'publisher_id',
			'languages',
			'categories',
			'no_of_pages',
			'purchase_price',
			'acc_no'
		]);
		console.log(data);
		// listifyData(data, ["authors", "subjects", "languages"]);
		// await borrowable.create(data);
	},
	update: async function ({ request }) {
		let { _id, ...updatedData } = await pojoData(request);
		listifyData(updatedData, ['authors', 'subjects', 'languages']);
		await Book.findOneAndUpdate({ _id }, updatedData);
	},
	delete: async function ({ request }) {
		const { _id } = await request.json();
		await Book.findOneAndDelete({ _id });
	}
};
