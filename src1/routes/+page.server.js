import { library } from '$lib/db.js';

export async function load() {
	return {
		libraries: await library.findMany({ cacheStrategy: { swr: 60, ttl: 3600 } })
	};
}
