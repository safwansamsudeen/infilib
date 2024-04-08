import { item } from './db.js';
import * as fs from 'fs';
import csv from 'csv-parser';

export async function importItems(file_obj, library_slug) {
	let c = 0;
	fs.read(file_obj)
		.pipe(csv())
		.on('data', async (row) => {
			// Process each row and create Prisma records
			try {
				// Split values separated by slash and trim whitespace
				const authors = row['Author'].split('/').map((author) => author.trim());
				const categories = row['Subject'].split('/').map((category) => category.trim());
				const languages = row['Medium'].split('/').map((language) => language.trim());

				const item_obj = await item.create({
					data: {
						library: { connect: { slug: library_slug } },
						status: 'IN',
						acc_no: parseInt(row['Acc. No.']),
						title: row['Title of the Book'],
						reference: row['Ref'] === 'Ref', // Assuming 'Ref' is a boolean field
						no_of_pages: parseInt(row['Pages']),
						call_no: parseFloat(row['Call no.']),
						level: row['Level'],
						publisher: {
							connectOrCreate: {
								where: { library_slug_name: { library_slug, name: row["Publisher's Name"] } },
								create: { library_slug, name: row["Publisher's Name"] }
							}
						},
						purchase_details: row['Purchase Details'],
						purchase_price: parseInt(row['Price']),
						remarks: row['Remarks'],
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
								subtitle: row['SubTitle'],
								authors: {
									connectOrCreate: authors.map((author) => ({
										where: { library_slug_name: { library_slug, name: author } },
										create: { library_slug, name: author }
									}))
								},
								edition: row['Edition/Year'],
								isbn: row['ISBN No.']
							}
						}
					}
				});
				c++;
			} catch (error) {
				console.error(`We couldn't create the item with accession number: ${row['Acc. No.']}.`);
				return;
			}
		})
		.on('end', () => {
			console.log(`CSV file successfully processed - with ${c} items added out of .`);
		});
}

// Run the import function
// importBooks('unity-public');
