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
