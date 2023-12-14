import Input from '$lib/subcomponents/Input.svelte';
import dayjs from 'dayjs';

export function capitalize(label) {
	return label
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

function setFormField(id, value) {
	document.getElementById(id).value = value || '';
}

export function findValue(array, key_value, key = 'id') {
	for (let obj of array) {
		if (obj[key] === key_value) {
			return obj;
		}
	}
}

export function prettify(records, columns) {
	for (let { id, type, opts } of columns) {
		if (type === 'select') {
			records.map(
				(record) =>
					(record[id] =
						opts.multiple === true
							? record[id].map((subRecord) => subRecord.name || subRecord[opts.label])
							: record[id].name || record[id][opts.label])
			);
		} else if (type === 'date') {
			records.map((record) => (record[id] = date(record[id])));
		}
	}
	return records;
}

function setSelectField(id, items, newValue, multi = false) {
	let value = multi ? [] : {};
	let foundItems;
	// Add new value(s) to item list
	if (multi) {
		for (let expectedValue of newValue) {
			foundItems = items.filter(({ value }) => value === expectedValue);
			if (!foundItems.length) {
				items.push({ id: expectedValue, name: expectedValue });
				value.push({ id: expectedValue, name: expectedValue });
			} else {
				value.push(foundItems[0]);
			}
		}
	} else {
		foundItems = items.filter(({ value, label }) => value === newValue || label === newValue);
		if (!foundItems.length) {
			items.push({ id: newValue, name: newValue });
			value = { id: newValue, name: newValue };
		} else {
			value = foundItems[0];
		}
	}

	// Empty component
	document.querySelector(`#${id}-div`).innerHTML = '';

	// Rerender component
	new Input({
		target: document.querySelector(`#${id}-div`),
		props: {
			id: id,
			type: 'select',
			opts: { value, items, multiple: multi },
			important: true
		}
	});
}

export function date(value, to_str = true, time = false, format = 'YYYY-MM-DD') {
	if (!value) {
		return null;
	}
	if (to_str) {
		if (time) {
			return dayjs(value).format('YYYY-MM-DD HH:mm');
		}
		return dayjs(value).format(format);
	}
	return new Date(value);
}

export async function setBookDetails(isbn, publishers, authors, languages, categories, scanner) {
	scanner?.pause?.();
	let res = await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn);
	let item = (await res.json()).items[0];
	let volumeInfo = item.volumeInfo;
	//   Populate form fields with request data
	setFormField('title', volumeInfo.title);
	setFormField('subtitle', volumeInfo.subtitle);
	setFormField('no_of_pages', volumeInfo.pageCount);
	setFormField('remarks', volumeInfo.description);
	setFormField('publication_year', volumeInfo.publishedDate?.split('-')[0]);
	setFormField('purchase_price', item.saleInfo.listPrice?.amount);
	setFormField('purchase_details', item.saleInfo.listPrice?.buyLink);
	setFormField('isbn', isbn);

	setSelectField('publisher', publishers, volumeInfo.publisher);
	setSelectField('authors', authors, volumeInfo.authors, true);
	setSelectField('languages', languages, [volumeInfo.language], true);
	setSelectField('categories', categories, volumeInfo.categories, true);
	return false;
}

export function flatten(records, key) {
	records.map((rec) => Object.entries(rec[key]).map(([id, value]) => (rec[id] = value)));
}

export function truncate(text, totalChars = 80, endChars = 20) {
	endChars = Math.min(endChars, totalChars);
	const start = text.slice(0, totalChars - endChars);
	const end = endChars > 0 ? text.slice(-endChars) : '';

	if (start.length + end.length < text.length) {
		return start + '…' + end;
	} else {
		return text;
	}
}

export function injectLibraryInSelect(data, library_slug) {
	if (Array.isArray(data.connectOrCreate)) {
		// Handle the case where the value is a list of objects
		return {
			connectOrCreate: data.connectOrCreate.map((item) => ({
				where: { library_slug_name: { library_slug, ...item.where } },
				create: {
					...item.create,
					library_slug
				}
			}))
		};
	} else {
		// Handle the case where the value is a single object
		return {
			connectOrCreate: {
				where: { library_slug_name: { library_slug, ...data.connectOrCreate.where } },
				create: {
					...data.connectOrCreate.create,
					library_slug
				}
			}
		};
	}
}

export function addDefaults(obj, { opts, ...data }) {
	if (data.type !== 'object') {
		return {
			...data,
			opts: {
				...opts,
				value: obj[data.id]
			}
		};
	} else {
		return {
			...data,
			columns: data.columns.map((col) => addDefaults(obj[data.id], col))
		};
	}
}
