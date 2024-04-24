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

export function getUserColumns(library_slug, opts = false) {
	const types =
		opts &&
		subscriptionType.findMany({
			...CACHE_STRATEGY,
			where: { library_slug }
		});
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
						goto: false,
						tableVisible: false
					}
				},
				{ id: 'purchased_on', type: 'date' },
				{ id: 'valid_till', type: 'date' },
				{ id: 'details' }
			]
		}
	].map(standardizeColumns);
}

export function getTransColumns(library_slug) {
	const users = user.findMany({
		...CACHE_STRATEGY,
		where: { subscriptions: { some: { type: { library_slug } } } }
	});

	const types = subscriptionType.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});
	const items = item.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});

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
				goto: false,
				tableVisible: false
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

export function getItemColumns(library_slug = null) {
	let categories = category.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});
	let languages = language.findMany({
		...CACHE_STRATEGY
	});
	let publishers = publisher.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});

	return [
		{ id: 'acc_no', name: 'Acc. No.', type: 'number' },
		{ id: 'title' },
		{
			id: 'publisher',
			type: 'select',
			opts: {
				options: publishers,
				goto: 'items/?publisher='
			}
		},
		{
			id: 'categories',
			type: 'select',
			opts: {
				multiple: true,
				options: categories,
				goto: '?categories='
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

export function getMagazineColumns() {
	return [
		{ id: 'issue' },
		{ id: 'volume' },
		{ id: 'sc_no', type: 'number' },
		{ id: 'from', type: 'date' },
		{ id: 'to', type: 'date' }
	].map(standardizeColumns);
}

export function getBookColumns(library_slug) {
	const authors = author.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});
	return [
		{
			id: 'authors',
			type: 'select',
			opts: {
				multiple: true,
				options: authors,
				goto: '?authors='
			}
		},
		{ id: 'isbn', type: 'text', name: 'ISBN' },
		{ id: 'subtitle', important: false },
		{ id: 'publication_year', type: 'number', name: 'Year Published', important: false },
		{ id: 'edition', important: false }
	].map(standardizeColumns);
}


export function getSubscriptionColumns() {
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

export function getLibrarySubscriptionColumns(library_slug) {
	const categories = category.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});
	const languages = language.findMany({
		...CACHE_STRATEGY
	});
	const publishers = publisher.findMany({
		...CACHE_STRATEGY,
		where: { library_slug }
	});
	return [
		{
			id: 'name'
		},
		{ id: 'ends_on', type: 'date' },
		{ id: 'no_of_weeks', name: 'Number of Weeks', type: 'number' },
		{ id: 'recurrence', type: 'number' },
		{ id: 'price', name: 'Total Price', type: 'number' },
		{
			id: 'publisher',
			type: 'select',
			opts: {
				options: publishers,
				goto: '?publisher='
			}
		},
		{ id: 'call_no', name: 'Call Number', type: 'number', important: false },
		{
			id: 'categories',
			type: 'select',
			opts: {
				multiple: true,
				options: categories,
				goto: '?categories='
			},
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
		}
	].map(standardizeColumns);
}