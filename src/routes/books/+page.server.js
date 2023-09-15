import prisma from '$lib/db.js';
import { pojoData, parseData, listifyData } from '$lib/helpers.js';

const { borrowable, publisher, author, category, language } = prisma;

export async function load() {
	const books = await borrowable.findMany();
	const publishers = await publisher.findMany();
	const authors = await author.findMany();
	const categories = await category.findMany();
	const languages = await language.findMany();

	return {
		books,
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
