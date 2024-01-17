import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());
(async function () {
	console.log('Starting connection');
	await prisma.$connect();
	console.log('Connected');
})();

export const {
	item,
	publisher,
	author,
	category,
	language,
	user,
	mark,
	transaction,
	library,
	subscriptionType,
	userSubscription
} = prisma;
