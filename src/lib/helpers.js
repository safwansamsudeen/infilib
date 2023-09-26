import Input from '$lib/components/Input.svelte';

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
			multiple: multi
		}
	});
}

export function date(value, to_str = true) {
	if (to_str) {
		return value?.toDateString();
	}
	return new Date(value);
}
