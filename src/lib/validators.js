export function validateUserProperty(value, property) {
	if (property === 'gender') {
		return value === 'M' || value === 'F';
	}
	if (property === 'email_address') {
		return value.toLowerCase().match(
			// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	}
	return true;
}
