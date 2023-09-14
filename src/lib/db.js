import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Starting connection');
await prisma.$connect();
console.log('Connected');

const { borrowable, publisher, author, category, language, user, mark, transaction } = prisma;

export { borrowable, publisher, author, category, language, user, mark, transaction };
