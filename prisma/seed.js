import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const GENDERS = [
	['M', 'Male'],
	['F', 'Female']
];
const USERS = [
	[1, 'safwansamsudeen@gmail.com', 'Safwan (Superuser)', ''],
	['F', 'Female']
];

async function main() {
	for (let [code, name] of GENDERS) {
		await prisma.gender.upsert({
			where: { code },
			update: {},
			create: { name, code }
		});
	}

	await prisma.language.upsert({
		where: { name: 'English' },
		update: {},
		create: {
			name: 'English'
		}
	});

	await prisma.user.upsert({
		where: { email_address: 'safwansamsudeen@gmail.com' },
		update: {},
		create: {
			id: 1,
			name: 'Safwan (Superuser)',
			email_address: 'safwansamsudeen@gmail.com',
			gender: { connect: { code: 'M' } }
		}
	});
	await prisma.user.upsert({
		where: { email_address: 'librarian.ups@unityschool.in' },
		update: {},
		create: {
			id: 1,
			name: 'Shakii',
			email_address: 'librarian.ups@unityschool.in',
			gender: { connect: { code: 'M' } }
		}
	});
	await prisma.library.upsert({
		where: { slug: 'unity-public' },
		update: {},
		create: {
			slug: 'unity-public',
			name: 'Unity Public School',
			address: 'Kottur, Chennai',
			administrator: { connect: { email_address: 'librarian.ups@unityschool.in' } }
		}
	});
	await prisma.library.upsert({
		where: { slug: 'test' },
		update: {},
		create: {
			slug: 'test',
			name: 'Test Library',
			address: 'Test Address, Test City, Weird Status, Mars',
			administrator: { connect: { email_address: 'safwansamsudeen@gmail.com' } }
		}
	});
	const subscription = await prisma.userSubscription.upsert({
		where: { library_slug_name: { library_slug: 'test', name: 'Membership' } },
		update: {},
		create: {
			library_slug_name: {
				library_slug: 'test',
				name: 'Membership',
				no_of_days: 15,
				no_of_books: 4,
				deposit: 500
			}
		}
	});
	await prisma.library.update({
		where: { slug: 'test' },
		data: {
			subscribed: {}
		}
	});
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
