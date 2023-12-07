import { getPassageId, storeUserData } from '$lib/auth.js';
import { serverResponse } from '$lib/serverHelpers.js';

export async function POST({ request }) {
	const data = await request.json();
	const passageId = await getPassageId(data.auth_token);
	return serverResponse(async () => await storeUserData(passageId));
}
