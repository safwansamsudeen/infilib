import { library } from '$lib/db';

export async function load() {
	return {
		libraries: library.findMany({ cacheStrategy: { swr: 60, ttl: 3600 } })
	};
}
