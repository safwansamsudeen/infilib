import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { DATABASE_URL } from '$env/static/private';

const prisma = new PrismaClient().$extends(withAccelerate());

console.log('Starting connection');
await prisma.$connect();
console.log('Connected');

const {
	item,
	publisher,
	author,
	category,
	language,
	user,
	mark,
	transaction,
	gender,
	library,
	subscriptionType,
	userSubscription
} = prisma;

export {
	item,
	publisher,
	author,
	category,
	language,
	user,
	mark,
	transaction,
	gender,
	library,
	subscriptionType,
	userSubscription
};
