import Input from '$lib/components/Input.svelte';
import dayjs from 'dayjs';

export function capitalize(label) {
	return label
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

export function setFormField(id, value) {
	document.getElementById(id).value = value || '';
}

export function findValue(array, key_value, key = 'id') {
	for (let obj of array) {
		if (obj[key] === key_value) {
			return obj;
		}
	}
}

export function standardize(records, columns, date_format = 'DD/MM/YYYY') {
	for (let { id, type, opts } of columns) {
		if (type === 'select' && !records[0]?.[id]?.label && !records[0]?.[id]?.[0]?.label) {
			records.map(
				(record) =>
					(record[id] =
						opts.multiple === true
							? record[id].map((subRecord) => ({
									value: subRecord[opts.unpacking.value],
									label: subRecord[opts.unpacking.label]
							  }))
							: {
									value: record[id]?.[opts.unpacking.value],
									label: record[id]?.[opts.unpacking.label]
							  })
			);
		}
		if (type === 'date') {
			records.map((record) => (record[id] = dayjs(record[id]).format(date_format)));
		}
	}
}

export function setSelectField(id, items, newValue, multi = false) {
	let value = multi ? [] : {};
	let foundItems;
	// Add new value(s) to item list
	if (multi) {
		for (let expectedValue of newValue) {
			foundItems = items.filter(({ value }) => value === expectedValue);
			if (!foundItems.length) {
				items.push({ value: expectedValue, label: expectedValue });
				value.push({ value: expectedValue, label: expectedValue });
			} else {
				value.push(foundItems[0]);
			}
		}
	} else {
		foundItems = items.filter(({ value, label }) => value === newValue || label === newValue);
		if (!foundItems.length) {
			items.push({ value: newValue, label: newValue });
			value = { value: newValue, label: newValue };
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

export function date(value, to_str = true, time = false) {
	if (!value) {
		return null;
	}
	if (to_str) {
		if (time) {
			return dayjs(value).format('YYYY-MM-DD HH:mm');
		}
		return dayjs(value).format('YYYY-MM-DD');
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

export function flatten(records, type) {
	records.map((rec) => Object.entries(rec[type]).map(([key, value]) => (rec[key] = value)));
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
				where: item.where,
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
				where: data.connectOrCreate.where,
				create: {
					...data.connectOrCreate.create,
					library_slug
				}
			}
		};
	}
}
