// Import necessary libraries
import { item } from './db.js';
import * as fs from 'fs';
import csv from 'csv-parser';

// Function to read the CSV file and import data into the database
async function importBooks() {
	// Specify the path to your CSV file
	fs.createReadStream('./src/lib/books.csv')
		.pipe(csv())
		.on('data', async (row) => {
			// Process each row and create Prisma records
			try {
				// Split values separated by slash and trim whitespace
				const authors = row['Author'].split('/').map((author) => author.trim());
				const languages = row['Medium'].split('/').map((language) => language.trim());

				const item_obj = await item.create({
					data: {
						library: { connect: { slug: 'anna-library' } },
						status: 'IN',
						acc_no: parseInt(row['Acc. No.']),
						title: row['Title of the Book'],
						reference: row['Ref'] === 'Ref', // Assuming 'Ref' is a boolean field
						no_of_pages: parseInt(row['Pages']),
						call_no: parseFloat(row['Call no.']),
						level: row['Level'],
						publisher: {
							connectOrCreate: {
								where: { name: row["Publisher's Name"] },
								create: { name: row["Publisher's Name"] }
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
							connectOrCreate: [
								{ where: { name: row['Subject'] }, create: { name: row['Subject'] } }
							]
						},
						book: {
							create: {
								subtitle: row['SubTitle'],
								authors: {
									connectOrCreate: authors.map((author) => ({
										where: { name: author },
										create: { name: author }
									}))
								},
								edition: row['Edition/Year'],
								isbn: row['ISBN No.']
							}
						}
					}
				});
				console.log(`Item created: ${item_obj.id}`);
			} catch (error) {
				console.error(`Error creating item: ${error.message}, ABORTING`);
				return;
			}
		})
		.on('end', () => {
			console.log('CSV file successfully processed.');
		});
}

// Run the import function
importBooks();
