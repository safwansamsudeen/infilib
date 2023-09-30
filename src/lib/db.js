import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Starting connection');
await prisma.$connect();
console.log('Connected');

const { item, publisher, author, category, language, user, mark, transaction, book, magazine } =
  prisma;

export { item, publisher, author, category, language, user, mark, transaction };
