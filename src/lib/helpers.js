export function capitalize(label) {
	return label
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

export function setFormField(id, value) {
	document.getElementById(id).value = value || '';
}
