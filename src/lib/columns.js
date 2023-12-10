/*
FILE FOR MANAGING COLUMNS
This file is the JSON version of the Prisma schema.
Based on the contents here, forms will be generated, validation will be ensured, and DB creation/updates will be managed.
Handle with care.
*/

import { capitalize } from '$lib/helpers.js';

import { author, category, language, user, item, subscriptionType, library } from '$lib/db.js';

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

function standardize({ name, important, type, columns, ...data }) {
	if (type === 'object') {
		return { ...data, name, type, columns: columns.map(standardize) };
	} else {
		return {
			...data,
			name: name || capitalize(data.id),
			important: important ?? true,
			type: type || 'text'
		};
	}
}

export async function getUserColumns(library_slug, opts = false) {
	const types =
		opts &&
		(await subscriptionType.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		}));
	return [
		{ id: 'name' },
		{
			id: 'gender',
			type: 'select',
			opts: {
				options: [
					{ value: 'M', label: 'Male' },
					{ value: 'F', label: 'Female' }
				],
				creatable: false,
				alias: { value: 'value', label: 'label' }
			}
		},
		{ id: 'email_address', type: 'email' },
		{ id: 'phone_number', type: 'tel', important: false },
		{ id: 'date_of_birth', type: 'date', important: false },
		{ id: 'about', important: false },
		{
			id: 'subscription',
			type: 'object',
			important: true,
			columns: [
				{ id: 'member_id', label: 'Member ID', type: 'number' },
				{
					id: 'type',
					label: 'Subscription Type',
					type: 'select',
					opts: {
						options: opts && types.map(({ id, name }) => ({ value: id, label: name })),
						alias: { value: 'id', label: 'name' },
						creatable: false
					}
				},
				{ id: 'purchased_on', type: 'date' },
				{ id: 'valid_till', type: 'date' },
				{ id: 'details' }
			]
		}
	].map(standardize);
}

export const getMarkColumns = normalize(async function () {
	return [
		{
			id: 'item'
		},
		{ id: 'user', type: 'hidden' },
		{ id: 'borrow_time', label: 'Time Of Pickup', type: 'datetime-local' },
		{ id: 'comments', type: 'textarea', required: false }
	];
});

export const getSubscriptionColumns = normalize(async function () {
	return [
		{
			id: 'label'
		},
		{ id: 'no_of_days', label: 'Maximum Number of Borrowing Days', type: 'number' },
		{ id: 'no_of_books', name: 'Maximum Number of Books', type: 'number' },
		{ id: 'deposit', type: 'number' },
		{ id: 'annual_price', type: 'number', important: false },
		{ id: 'half_yearly_price', type: 'number', important: false }
	];
});

export async function getTransColumns(library_slug, opts = false) {
	const users =
		opts &&
		(await user.findMany({
			...CACHE_STRATEGY,
			where: { subscriptions: { some: { type: { library_slug } } } }
		}));
	const items =
		opts &&
		(await item.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		}));

	return [
		{ id: 'id', type: 'hidden' },
		{
			id: 'user',
			type: 'select',
			opts: {
				options:
					opts &&
					users.map(({ id, name }) => ({
						value: id,
						label: name
					})),
				alias: {
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
				options:
					opts &&
					items.map(({ id, title }) => ({
						value: id,
						label: title
					})),
				alias: {
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
	].map(standardize);
}

export async function getItemColumns(library_slug, opts = false) {
	let categories, languages;
	if (opts) {
		categories = await category.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		});
		languages = await language.findMany({
			...CACHE_STRATEGY
		});
	}

	return [
		{ id: 'acc_no', label: 'Acc. No.', type: 'number', important: false, required: true },
		{ id: 'call_no', type: 'number', opts: { step: 0.01 } },
		{ id: 'title' },
		{ id: 'status', opts: { value: 'IN', disabled: true } },
		{
			id: 'publisher',
			type: 'object',
			important: true,
			columns: [{ id: 'name' }, { id: 'address', type: 'textarea' }]
		},
		{
			id: 'categories',
			type: 'select',
			opts: {
				multiple: true,
				options: opts && categories.map(({ slug, name }) => ({ value: slug, label: name })),
				alias: { value: 'id', label: 'name' }
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
				options: opts && languages.map(({ code, name }) => ({ value: code, label: name })),
				alias: { value: 'code', label: 'name' }
			},
			important: false
		},
		{ id: 'purchase_details', important: false },
		{ id: 'image_url', label: 'Image URL', important: false },
		{ id: 'level', important: false },
		{ id: 'remarks', type: 'textarea', important: false },
		{ id: 'reference', type: 'checkbox' }
	];
}

export async function getBookColumns(library_slug, opts) {
	const authors =
		opts &&
		(await author.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		}));
	return [
		...(await getItemColumns(library_slug, opts)),
		{
			id: 'authors',
			type: 'select',
			opts: {
				multiple: true,
				options: opts && authors.map(({ id, name }) => ({ value: id, label: name })),
				aliases: {
					value: 'id',
					label: 'name'
				}
			}
		},
		{ id: 'isbn', type: 'text', label: 'ISBN' },
		{ id: 'subtitle', important: false },
		{ id: 'publication_year', type: 'number', label: 'Year Published', important: false },
		{ id: 'edition', important: false }
	];
}

export async function getMagazineColumns(library_slug, opts) {
	return [
		...(await getItemColumns(library_slug, opts)),
		{ id: 'issue' },
		{ id: 'volume' },
		{ id: 'sc_no', type: 'number' },
		{ id: 'from', type: 'date' },
		{ id: 'to', type: 'date' }
	];
}
