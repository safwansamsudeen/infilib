/*
FILE FOR MANAGING COLUMNS
This file is the JSON version of the Prisma schema.
Based on the contents here, forms will be generated, validation will be ensured, and DB creation/updates will be managed.
Handle with care.
*/

import { capitalize, date } from '$lib/helpers.js';
import { author, category, language, publisher, gender, user, item } from '$lib/db.js';

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

export const getUserColumns = normalize(async function () {
	const genders = await gender.findMany();
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

export const getTransColumns = normalize(async function () {
	const users = await user.findMany();
	const items = await item.findMany();

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
		{ id: 'comments', type: 'textarea', required: false }
	];
	return res;
});

export const getItemColumns = normalize(async function () {
	const authors = await author.findMany();
	const publishers = await publisher.findMany();
	const categories = await category.findMany();
	const languages = await language.findMany();

	const columns = [
		{ id: 'id', name: 'Acc. No.', type: 'number' },
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
		{
			id: 'purchase_price',
			type: 'number',
			important: false
		},
		{ id: 'purchase_details', important: false },
		{ id: 'level', important: false },
		{ id: 'remarks', type: 'textarea', important: false },
		{ id: 'reference', type: 'checkbox' }
	];
	const others = {
		book: [
			{ id: 'subtitle', important: false },
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
