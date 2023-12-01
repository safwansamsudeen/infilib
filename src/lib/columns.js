/*
FILE FOR MANAGING COLUMNS
This file is the JSON version of the Prisma schema.
Based on the contents here, forms will be generated, validation will be ensured, and DB creation/updates will be managed.
Handle with care.
*/

import { capitalize } from '$lib/helpers.js';

import {
	author,
	category,
	language,
	publisher,
	gender,
	user,
	item,
	subscriptionType
} from '$lib/db.js';

const CACHE_STRATEGY = { cacheStrategy: { swr: 60, ttl: 60 } };
function normalize(fn) {
	// I have next to no idea what this monolith is doing but I'm sure it's crucial
	return async function (...args) {
		let res = await fn(...args);
		if (Array.isArray(res[0])) {
			return [
				res[0].map(({ name, important, ...data }) => {
					return {
						...data,
						name: name || capitalize(data.id),
						important: important ?? true
					};
				}),
				Object.fromEntries(
					Object.entries(res[1]).map(([name, columns]) => [
						name,
						columns.map((obj) => ({
							...obj,
							name: obj.name || capitalize(obj.id),
							important: obj.important ?? true
						}))
					])
				)
			];
		}
		return res.map(({ name, important, ...data }) => {
			return {
				...data,
				name: name || capitalize(data.id),
				important: important ?? true
			};
		});
	};
}

export const getUserColumns = normalize(async function (library_slug) {
	const genders = await gender.findMany(CACHE_STRATEGY);
	const subscriptions = await subscriptionType.findMany({
		...CACHE_STRATEGY,
		where: { library_slug: library_slug }
	});
	return [
		{ id: 'id', name: 'ID', type: 'number' },
		{ id: 'name' },
		{
			id: 'gender',
			type: 'select',
			important: true,
			opts: {
				creatable: false,
				items: genders.map(({ code, name }) => ({
					value: code,
					label: name
				})),
				unpacking: {
					value: 'code',
					label: 'name'
				}
			}
		},
		{
			id: 'subscriptions',
			name: 'Subscription',
			type: 'select',
			important: true,
			opts: {
				multiple: true,
				uiSingle: true,
				creatable: false,
				items: subscriptions.map(({ id, name }) => ({
					value: id,
					label: name
				})),
				unpacking: {
					value: 'id',
					label: 'name'
				}
			}
		},
		{ id: 'details' },
		{ id: 'email_address', type: 'email' }
	];
});

export const getMarkColumns = normalize(async function () {
	return [
		{
			id: 'item'
		},
		{ id: 'user', type: 'hidden' },
		{ id: 'borrow_time', name: 'Time Of Pickup', type: 'datetime-local' },
		{ id: 'comments', type: 'textarea', required: false }
	];
});

export const getSubscriptionColumns = normalize(async function () {
	return [
		{
			id: 'name'
		},
		{ id: 'no_of_days', name: 'Maximum Number of Borrowing Days', type: 'number' },
		{ id: 'no_of_books', name: 'Maximum Number of Books', type: 'number' },
		{ id: 'deposit', type: 'number' },
		{ id: 'annual_price', type: 'number', important: false },
		{ id: 'half_yearly_price', type: 'number', important: false }
	];
});

export const getTransColumns = normalize(async function () {
	const users = await user.findMany(CACHE_STRATEGY);
	const items = await item.findMany(CACHE_STRATEGY);

	let res = [
		{ id: 'id', type: 'hidden' },
		{
			id: 'user',
			name: 'User',
			type: 'select',
			opts: {
				items: users.map(({ id, name }) => ({
					value: id,
					label: name
				})),
				unpacking: {
					value: 'id',
					label: 'name'
				},
				creatable: false
			}
		},
		{
			id: 'item',
			type: 'select',
			opts: {
				items: items.map(({ id, title }) => ({
					value: id,
					label: title
				})),
				unpacking: {
					value: 'id',
					label: 'title'
				},
				creatable: false
			}
		},
		{ id: 'issued_at', type: 'date' },
		{ id: 'due_at', type: 'date' },
		{ id: 'returned_at', type: 'date', hidden: true },
		{ id: 'price', type: 'number', important: true },
		{ id: 'comments', type: 'textarea', important: false }
	];
	return res;
});

export const getItemColumns = normalize(async function () {
	const authors = await author.findMany(CACHE_STRATEGY);
	const publishers = await publisher.findMany(CACHE_STRATEGY);
	const categories = await category.findMany(CACHE_STRATEGY);
	const languages = await language.findMany(CACHE_STRATEGY);

	const columns = [
		{ id: 'id', name: 'Internal ID', type: 'hidden', important: false },
		{ id: 'acc_no', name: 'Acc. No.', type: 'number', important: false, required: true },
		{ id: 'call_no', type: 'number', opts: { step: 0.01 } },
		{ id: 'title' },
		{ id: 'status', type: 'hidden', opts: { value: 'IN', readOnly: true } },
		{
			id: 'publisher',
			type: 'select',
			opts: {
				items: publishers.map(({ id, name }) => ({
					value: id,
					label: name
				})),
				unpacking: {
					value: 'id',
					label: 'name'
				}
			}
		},
		{
			id: 'categories',
			type: 'select',
			opts: {
				multiple: true,
				items: categories.map(({ id, name }) => ({ value: id, label: name })),
				unpacking: {
					value: 'id',
					label: 'name'
				}
			}
		},
		{ id: 'no_of_pages', type: 'number' },
		{
			id: 'purchase_price',
			type: 'number'
		},
		{
			id: 'languages',
			type: 'select',
			opts: {
				multiple: true,
				items: languages.map(({ id, name }) => ({ value: id, label: name })),
				unpacking: {
					value: 'id',
					label: 'name'
				}
			},
			important: false
		},

		{ id: 'purchase_details', important: false },
		{ id: 'image_url', name: 'Image URL', important: false },
		{ id: 'level', important: false },
		{ id: 'remarks', type: 'textarea', important: false },
		{ id: 'reference', type: 'checkbox' }
	];
	const others = {
		book: [
			{
				id: 'authors',
				type: 'select',
				opts: {
					multiple: true,
					items: authors.map(({ id, name }) => ({ value: id, label: name })),
					unpacking: {
						value: 'id',
						label: 'name'
					}
				}
			},
			{ id: 'isbn', type: 'text', name: 'ISBN' },
			{ id: 'subtitle', important: false },
			{ id: 'publication_year', type: 'number', name: 'Year Published', important: false },
			{ id: 'edition', important: false }
		],
		magazine: [
			{ id: 'issue' },
			{ id: 'volume' },
			{ id: 'sc_no', type: 'number' },
			{ id: 'from', type: 'date' },
			{ id: 'to', type: 'date' }
		]
	};
	return [columns, others];
});
