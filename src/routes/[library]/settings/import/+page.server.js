import { fail } from '@sveltejs/kit';
import { response } from '$lib/helpers.js';
import Papa from 'papaparse';
import { item } from '$lib/db.js';

async function importItem(row, library_slug) {
	try {
		// Split values separated by slash and trim whitespace
		const authors = row['Author']?.split('/')?.map((author) => author.trim()) || [];
		const categories = row['Subject']?.split('/')?.map((category) => category.trim())|| [];
		const languages = row['Medium']?.split('/')?.map((language) => language.trim())|| [];

		await item.create({
			data: {
				library: { connect: { slug: library_slug } },
				status: 'IN',
				acc_no: +row['Acc. No.'],
				title: row['Title of the Book'],
				reference: row['Ref'] === 'Ref', // Assuming 'Ref' is a boolean field
				no_of_pages: +row['Pages'],
				call_no: +row['Call no.'],
				level: "" + row['Level'],
				publisher: {
					connectOrCreate: {
						where: { library_slug_name: { library_slug, name: row["Publisher's Name"] } },
						create: { library_slug, name: row["Publisher's Name"] }
					}
				},
				purchase_details: "" + row['Purchase Details'],
				purchase_price: +row['Price'] || 0,
				remarks: "" + row['Remarks'],
				languages: {
					connectOrCreate: languages.map((lang) => ({
						where: { name: lang },
						create: { name: lang }
					}))
				},
				categories: {
					connectOrCreate: categories.map((name) => ({
						where: { library_slug_name: { library_slug, name } },
						create: { library_slug, name }
					}))
				},
				book: {
					create: {
						subtitle: "" + row['SubTitle'],
						authors: {
							connectOrCreate: authors.map((author) => ({
								where: { library_slug_name: { library_slug, name: author } },
								create: { library_slug, name: author }
							}))
						},
						edition: "" + row['Edition/Year'],
						isbn: "" + row['ISBN No.']
					}
				}
			}
		});
		created.push(+row['Acc. No.']);
	} catch (error) {
		return false
	}

	return true;
}

export const actions = {
	test: async ({ request, params }) => {
		return response(async () => {
			const { importFile } = Object.fromEntries(await request.formData());

			if (!importFile?.name || importFile.name === 'undefined') {
				return fail(400, {
					incorrect: true,
					message: 'You must provide a file to upload'
				});
			}
			let buffer = new Buffer(await importFile.arrayBuffer());
			let failures = [];
			Papa.parse(buffer.toString(), {
				header: true,
				transformHeader: (str) => str.trim(),
				dynamicTyping: true,
				step: async function ({ data }, parser) {
					const created = await importItem(data, params.library);
					if (!created) failures.push(data['Acc. No.'])
				}
			});
			console.log(failures)
			return {failures}
		}, true);
	}
};
