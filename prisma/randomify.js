import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const generateFakeData = async () => {
	const books = Array.from({ length: 50 }, (_, index) => ({
		subtitle: faker.lorem.sentence(),
		authors: {
			connectOrCreate: {
				where: { library_slug_name: { name: faker.person.fullName(), library_slug: 'test' } },
				create: { name: faker.person.fullName(), library_slug: 'test' }
			}
		},
		publication_year: faker.number.int({ min: 1800, max: 2022 }),
		edition: faker.word.words(),
		isbn: faker.string.uuid(),
		item: {
			create: {
				acc_no: faker.number.int({ min: 1000, max: 100000 }),
				title: faker.word.words({ count: { min: 2, max: 6 } }).trimEnd('.'),
				status: 'IN',
				publisher: {
					connectOrCreate: {
						where: { library_slug_name: { name: faker.word.words(2), library_slug: 'test' } },
						create: { name: faker.word.words(2), library_slug: 'test' }
					}
				},
				languages: {
					connectOrCreate: { where: { name: 'English' }, create: { name: 'English' } }
				},
				categories: {
					connectOrCreate: {
						where: { library_slug_name: { name: faker.word.adjective(), library_slug: 'test' } },
						create: { name: faker.word.adjective(), library_slug: 'test' }
					}
				},
				reference: index % 2 === 0, // Set every other magazine as reference
				call_no: faker.number.float({ precision: 0.1 }),
				no_of_pages: faker.number.int({ max: 1000 }),
				purchase_price: faker.number.int({ max: 1000 }),
				library: { connect: { slug: 'test' } },
				level: 'Beginner'
			}
		}
	}));

	const magazines = Array.from({ length: 30 }, (_, index) => ({
		sc_no: index + 1,
		issn: faker.string.uuid(),
		volume: `Volume ${index + 1}`,
		issue: `Issue ${index + 1}`,
		from: faker.date.past(),
		to: faker.date.future(),
		item: {
			create: {
				acc_no: faker.number.int({ min: 1000, max: 100000 }),
				title: faker.word.words({ count: { min: 5, max: 10 } }).trimEnd('.'),
				status: 'IN',
				publisher: {
					connectOrCreate: {
						where: { library_slug_name: { name: faker.word.words(2), library_slug: 'test' } },
						create: { name: faker.word.words(2), library_slug: 'test' }
					}
				},
				languages: {
					connectOrCreate: { where: { name: 'English' }, create: { name: 'English' } }
				},
				categories: {
					connectOrCreate: {
						where: { library_slug_name: { name: faker.word.adjective(), library_slug: 'test' } },
						create: { name: faker.word.adjective(), library_slug: 'test' }
					}
				},
				reference: index % 2 === 0,
				call_no: faker.number.float({ precision: 0.1 }),
				no_of_pages: faker.number.int({ max: 1000 }),
				purchase_price: faker.number.int({ max: 1000 }),
				library: { connect: { slug: 'test' } },
				level: 'Beginner'
			}
		}
	}));
	const members = Array.from({ length: 100 }, () => ({
		passage_id: faker.string.uuid(),
		name: faker.person.fullName(),
		email_address: faker.internet.email(),
		gender: faker.helpers.arrayElement(['M', 'F']),
		about: faker.lorem.sentence(),
		phone_number: faker.phone.number(),
		date_of_birth: faker.date.between({ from: '1950-01-01', to: '2003-12-31' }),
		subscriptions: {
			create: [
				{
					type: {
						connect: { library_slug_name: { name: 'Membership', library_slug: 'test' } }
					},
					member_id: faker.number.int({ min: 1000, max: 100000 }),
					purchased_on: faker.date.past(),
					valid_till: faker.date.future(),
					active: true
				}
			]
		}
	}));

	for (const member of members) {
		await prisma.user.create({
			data: member
		});
	}

	for (let book of books) {
		try {
			await prisma.book.create({
				data: book
			});
		} catch (e) {
			console.log('Collision with', book.item.create.acc_no);
		}
	}
	for (let magazine of magazines) {
		try {
			await prisma.magazine.create({
				data: magazine
			});
		} catch (e) {
			console.log('Collision with', magazine.item.create.acc_no);
		}
	}

	console.log('All random data created successfully');
};

const generateFakeTransactions = async () => {
	const totalUsers = 200;
	const totalItems = 200;

	// Create around 100 fake transactions
	const transactions = Array.from({ length: 100 }, () => {
		const userId = faker.number.int({ min: 100, max: totalUsers });
		const itemId = faker.number.int({ min: 100, max: totalItems });
		const borrowedAt = faker.date.past({ years: 1 });
		const returnedAt = faker.datatype.boolean()
			? faker.date.between({ from: borrowedAt, to: new Date() })
			: null;
		const subscriptionId = userId;
		const price = faker.number.int({ min: 10, max: 300 });
		const fine = faker.number.int({ min: 100, max: 500 });

		return {
			user_id: userId,
			item_id: itemId,
			issued_at: borrowedAt,
			due_at: faker.date.future(),
			returned_at: returnedAt,
			subscription_id: subscriptionId,
			price: price,
			fine: fine,
			comments: faker.lorem.sentence()
		};
	});

	// Insert transactions into the database
	for (let trans of transactions) {
		try {
			await prisma.transaction.create({
				data: trans
			});
		} catch (e) {
			console.log('Collision with', trans.itemId, 'and', trans.userId);
		}
	}

	console.log('Fake transactions created successfully');
};

async function main() {
	await generateFakeData();
	await generateFakeTransactions();
}

// Call the function to generate random books and magazines
main()
	.catch((error) => console.error(error))
	.finally(async () => {
		// Close the Prisma Client connection
		await prisma.$disconnect();
	});
