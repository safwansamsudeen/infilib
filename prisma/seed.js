import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
	await prisma.gender.upsert({
		where: { name: 'Male' },
		update: {},
		create: {
			name: 'Male',
			code: 'M'
		}
	});
	await prisma.gender.upsert({
		where: { name: 'Female' },
		update: {},
		create: {
			name: 'Female',
			code: 'F'
		}
	});
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
	await prisma.library.upsert({
		where: { slug: 'unity-public' },
		update: {},
		create: {
			slug: 'unity-public',
			name: 'Unity Public School',
			address: 'Test Address, Test City, Weird Status, Mars',
			administrator: { connect: { email_address: 'safwansamsudeen@gmail.com' } },
			subscribed: { connect: [{ email_address: 'safwansamsudeen@gmail.com' }] }
		}``
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
