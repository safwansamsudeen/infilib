import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const GENDERS = [
	['M', 'Male'],
	['F', 'Female']
];

const USERS = [
	[1, 'safwansamsudeen@gmail.com', 'Safwan (Superuser)', 'M'],
	[2, 'librarian.ups@unityschool.in', 'Shakii', 'M']
];

const LIBRARIES = [
	['unity-public', 'Unity Public School', 'Kottur, Chennai', 'librarian.ups@unityschool.in'],
	[
		'test',
		'The Testing Library',
		'Test Address, Random City, Weird Country, Mars',
		'safwansamsudeen@gmail.com'
	]
];

async function main() {
	for (let [code, name] of GENDERS) {
		await prisma.gender.upsert({
			where: { code },
			update: {},
			create: { name, code }
		});
	}

	for (let [id, email_address, name, gender_code] of USERS) {
		await prisma.user.upsert({
			where: { email_address },
			update: {},
			create: {
				id,
				name,
				email_address,
				gender: { connect: { code: gender_code } }
			}
		});
	}
	let library;
	for (let [slug, name, address, email_address] of LIBRARIES) {
		await prisma.library.upsert({
			where: { slug: slug },
			update: {},
			create: {
				slug,
				name,
				address,
				administrator: { connect: { email_address } },
				languages: { create: { name: 'English' } },
				available_subscriptions: {
					create: {
						name: 'Membership',
						no_of_days: 15,
						no_of_books: 4,
						deposit: 500,
						users: {
							create: {
								user: { connect: { email_address } }
							}
						}
					}
				}
			}
		});
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
