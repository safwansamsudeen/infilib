export function handleError({ error }) {
	console.log(error);
	return {
		message: 'Whoops!',
		code: error?.code ?? 'UNKNOWN'
	};
}
