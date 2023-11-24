import { library } from '$lib/db.js';

export async function load() {
	return {
		libraries: await library.findMany()
	};
}
