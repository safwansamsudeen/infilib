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
			items,
			type: 'select',
			opts: { value },
			multiple: multi,
			important: true
		}
	});
}

export function date(value, to_str = true) {
	if (!value) {
		return null;
	}
	if (to_str) {
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
}
