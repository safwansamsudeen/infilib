/*
FILE FOR MANAGING COLUMNS
This file is the JSON version of the Prisma schema.
Based on the contents here, forms will be generated, validation will be ensured, and DB creation/updates will be managed.
Handle with care.
*/

import { capitalize } from '$lib/helpers.js';

import { author, category, language, user, item, subscriptionType, publisher } from '$lib/db.js';

const CACHE_STRATEGY = { cacheStrategy: { swr: 60, ttl: 60 } };

function standardizeColumns({ name, important, type, columns, ...data }) {
	if (type === 'object') {
		return { ...data, name, type, columns: columns.map(standardizeColumns) };
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
					{ id: 'M', name: 'Male' },
					{ id: 'F', name: 'Female' }
				],
				creatable: false,
				goto: false
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
						options: types,
						creatable: false,
						goto: false
					}
				},
				{ id: 'purchased_on', type: 'date' },
				{ id: 'valid_till', type: 'date' },
				{ id: 'details' }
			]
		}
	].map(standardizeColumns);
}

export async function getMarkColumns() {
	return [
		{
			id: 'item'
		},
		{ id: 'user', type: 'hidden' },
		{ id: 'borrow_time', name: 'Time Of Pickup', type: 'datetime-local' },
		{ id: 'comments', type: 'textarea', opts: { required: false } }
	].map(standardizeColumns);
}

export async function getSubscriptionColumns() {
	return [
		{
			id: 'name'
		},
		{ id: 'no_of_days', name: 'Maximum Number of Borrowing Days', type: 'number' },
		{ id: 'no_of_books', name: 'Maximum Number of Books', type: 'number' },
		{ id: 'deposit', type: 'number' },
		{ id: 'annual_price', type: 'number', important: false },
		{ id: 'half_yearly_price', type: 'number', important: false }
	].map(standardizeColumns);
}

export async function getTransColumns(library_slug, opts = false) {
	const users =
		opts &&
		(await user.findMany({
			...CACHE_STRATEGY,
			where: { subscriptions: { some: { type: { library_slug } } } }
		}));

	const types =
		opts &&
		(await subscriptionType.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		}));
	const items =
		opts &&
		(await item.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		}));

	return [
		{ id: 'id', name: 'ID', type: 'hidden' },
		{
			id: 'user',
			type: 'select',
			opts: {
				options: users,
				creatable: false,
				goto: 'members/'
			}
		},
		{
			id: 'subscription',
			type: 'select',
			opts: {
				options: types,
				creatable: false,
				disabled: true,
				goto: false
			}
		},
		{
			id: 'item',
			type: 'select',
			opts: {
				options: items,
				itemId: 'id',
				label: 'title',
				creatable: false
			}
		},
		{ id: 'issued_at', type: 'date' },
		{ id: 'due_at', type: 'date' },
		{ id: 'returned_at', type: 'date', opts: { formRemoved: true } },
		{ id: 'price', type: 'number', important: true },
		{ id: 'comments', type: 'textarea', important: false, opts: { tableVisible: true } }
	].map(standardizeColumns);
}

export async function getItemColumns(library_slug = null, opts = false) {
	let categories, languages, publishers;
	if (opts) {
		categories = await category.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		});
		languages = await language.findMany({
			...CACHE_STRATEGY
		});
		publishers = await publisher.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		});
	}

	return [
		{ id: 'acc_no', name: 'Acc. No.', type: 'number' },
		{ id: 'title' },
		{
			id: 'publisher',
			type: 'select',
			opts: {
				options: publishers
			}
		},
		{
			id: 'categories',
			type: 'select',
			opts: {
				multiple: true,
				options: categories
			}
		},
		{ id: 'status', opts: { value: 'IN', readonly: true } },
		{ id: 'no_of_pages', name: 'Number of Pages', type: 'number', important: false },
		{ id: 'call_no', name: 'Call. No.', type: 'number', opts: { step: 0.01 }, important: false },
		{
			id: 'purchase_price',
			type: 'number',
			important: false
		},
		{
			id: 'purchased_on',
			type: 'date',
			important: false
		},
		{
			id: 'languages',
			type: 'select',
			opts: {
				multiple: true,
				options: languages
			},
			important: false
		},
		{ id: 'purchase_details', important: false },
		{ id: 'image_url', name: 'Image URL', important: false },
		{ id: 'level', important: false },
		{ id: 'remarks', type: 'textarea', important: false },
		{ id: 'reference', type: 'checkbox' }
	].map(standardizeColumns);
}

export async function getBookColumns(library_slug, opts) {
	const authors =
		opts &&
		(await author.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		}));
	return [
		{
			id: 'authors',
			type: 'select',
			opts: {
				multiple: true,
				options: authors
			}
		},
		{ id: 'isbn', type: 'text', name: 'ISBN' },
		{ id: 'subtitle', important: false },
		{ id: 'publication_year', type: 'number', name: 'Year Published', important: false },
		{ id: 'edition', important: false }
	].map(standardizeColumns);
}

export async function getMagazineColumns() {
	return [
		{ id: 'issue' },
		{ id: 'volume' },
		{ id: 'sc_no', type: 'number' },
		{ id: 'from', type: 'date' },
		{ id: 'to', type: 'date' }
	].map(standardizeColumns);
}

export function getSearchColumns() {
	return [
		{ id: 'title', name: 'Title (including subtitle)' },
		{ id: 'publisher' },
		{ id: 'authors' },
		{ id: 'categories' },
		{ id: 'isbn', name: 'ISBN/ISSN' },
		{ id: 'year_published' },
		{ id: 'purchase_details' },
		{ id: 'call_no', name: 'Call Number' }
	].map((col) => ({ ...col, important: false }));
}
