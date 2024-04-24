import { item, transaction, user } from '$lib/db.js';

export async function load({ params }) {
	// user stats
	const _users = await user.findMany({
		where: {
			subscriptions: { some: { type: { library_slug: params.library } } }
		},
		include: { subscriptions: { include: { type: true } } }
	});
	const nmale = _users.reduce((c, user) => c + (user.gender === 'M'), 0);
	const nactive = _users.reduce(
		(c, user) =>
			c +
			!!user.subscriptions.find(
				({ type, active }) => active && type.library_slug === params.library
			),
		0
	);
	const ageCategories = [
		[-Infinity, 12],
		[13, 18],
		[19, 25],
		[26, 35],
		[36, 50],
		[51, 60],
		[61, 70],
		[71, Infinity]
	];
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const thisMonth = [new Date(year, month), new Date(year, month + 1)];
	const thisYear = [new Date(year, 0), new Date(year + 1, 0)];
	const users = {
		n: _users.length,
		categories: {
			gender: [nmale, _users.length - nmale],
			age: {},
			subscriptionActivity: [nactive, _users.length - nactive]
		},
		nsubscribed: {
			thisMonth: _users.reduce(
				(c, user) =>
					c +
					(!!user.subscriptions.find(
						({ type, active }) => active && type.library_slug === params.library
					) &&
						thisMonth[0] <= user.purchased_on &&
						user.purchased_on < thisMonth[1]),
				0
			),
			thisYear: _users.reduce(
				(c, user) =>
					c +
					(!!user.subscriptions.find(
						({ type, active }) => active && type.library_slug === params.library
					) &&
						thisYear[0] <= user.purchased_on &&
						user.purchased_on < thisYear[1]),
				0
			)
		},
		subscriptionTypes: {}
	};
	for (const user of _users) {
		const age = new Date(new Date() - user.date_of_birth).getFullYear() - 1970;
		for (const category of ageCategories) {
			if (category[0] <= age && age <= category[1]) {
				if (!users.categories.age[category]) {
					users.categories.age[category] = 1;
				} else {
					users.categories.age[category]++;
				}
			}
		}
		const sub = user.subscriptions.find(
			({ type, active }) => active && type.library_slug === params.library
		);
		if (!!sub) {
			if (!users.subscriptionTypes[sub.type.name]) {
				users.subscriptionTypes[sub.type.name] = 0;
			}
			users.subscriptionTypes[sub.type.name]++;
		}
	}
	// item stats
	const _items = await item.findMany({
		where: { library_slug: params.library },
		include: {
			book: { include: { authors: true } },
			magazine: true,
			publisher: true,
			categories: true,
			languages: true
		}
	});
	const items = makeItemsObject(_items);
	// transaction stats
	const today = new Date();
	const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
	const _transactions = await transaction.findMany({
		where: { item: { library_slug: params.library }, issued_at: { gte: threeMonthsAgo } },
		include: {
			item: {
				include: {
					book: { include: { authors: true } },
					magazine: true,
					publisher: true,
					categories: true,
					languages: true
				}
			}
		}
	});
	const transactionItems = [];
	let dailyTransactions = {};
	for (const transaction of _transactions) {
		if (!transactionItems.find((item) => item.id == transaction.item.id)) {
			transactionItems.push(transaction.item);
		}
		const issued_at = transaction.issued_at;
		const date = new Date(issued_at.getFullYear(), issued_at.getMonth(), issued_at.getDate());
		if (!dailyTransactions[date]) {
			dailyTransactions[date] = 0;
		}
		dailyTransactions[date]++;
	}
	dailyTransactions = Object.keys(dailyTransactions)
		.map((d) => new Date(d))
		.sort((a, b) => b - a)
		.reduce(
			(acc, key) => {
				acc[0].push(key);
				acc[1].push(dailyTransactions[key.toString()]);
				return acc;
			},
			[[], []]
		);
	const transactions = { n: _transactions.length, overTimePeriod: { daily: dailyTransactions } };
	const borrowedItems = makeItemsObject(transactionItems);
	return {
		items,
		borrowedItems,
		transactions,
		users
	};
}

function makeItemsObject(_items) {
	const authorCounts = {};
	const publisherCounts = {};
	const categoryCounts = {};
	const languageCounts = {};
	let nbooks = 0;
	let npages = 0;
	let worth = 0;
	let reference = 0;
	let borrowed = 0;
	let available = 0;
	let damagedLost = 0;
	let nValidMagazines = 0;
	const bookLevels = new Set();
	const callNums = new Set();
	for (const item of _items) {
		nbooks += !!item.book;
		npages += item.no_of_pages;
		worth += item.purchase_price;
		reference += item.reference;
		borrowed += item.status === 'OUT';
		available += !item.reference && item.status === 'IN';
		damagedLost += item.status === 'UNAVAILABLE';
		nValidMagazines += item.magazine?.to > new Date();
		bookLevels.add(item.level);
		callNums.add(item.call_no);
		for (const { name } of item.book?.authors || []) {
			if (!authorCounts[name]) {
				authorCounts[name] = 0;
			}
			authorCounts[name]++;
		}
		for (const { name } of item.categories || []) {
			if (!categoryCounts[name]) {
				categoryCounts[name] = 0;
			}
			categoryCounts[name]++;
		}
		for (const { name } of item.languages || []) {
			if (!languageCounts[name]) {
				languageCounts[name] = 0;
			}
			languageCounts[name]++;
		}
		const publisher = item.publisher.name;
		if (!publisherCounts[publisher]) {
			publisherCounts[publisher] = 0;
		}
		publisherCounts[publisher]++;
	}
	return {
		n: _items.length,
		npages,
		worth,
		categories: {
			type: [nbooks, _items.length - nbooks],
			status: {
				reference,
				borrowed,
				available,
				damagedLost
			}
		},
		nValidMagazines,
		nBookLevels: bookLevels.size,
		nCallNums: callNums.size,
		nPublishers: Object.keys(publisherCounts).length,
		nAuthors: Object.keys(authorCounts).length,
		authorCounts,
		publisherCounts,
		categoryCounts,
		languageCounts
	};
}
