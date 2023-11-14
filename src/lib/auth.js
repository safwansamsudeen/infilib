import Passage from '@passageidentity/passage-node';
import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
import { PASSAGE_API_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { user } from '$lib/db.js';
import { findOr404 } from '$lib/serverHelpers.js';

export async function getCurrentUser(psg_auth_token) {
	const passage = new Passage({
		appID: PUBLIC_PASSAGE_APP_ID,
		apiKey: PASSAGE_API_KEY,
		authStrategy: 'HEADER'
	});
	let userID;
	try {
		const req = {
			headers: {
				authorization: `Bearer ${psg_auth_token}`
			}
		};
		userID = await passage.authenticateRequest(req);
	} catch (error) {
		throw redirect(302, '/login');
	}
	const user_passage = await passage.user.get(userID);
	return user.findUnique({ where: { email_address: user_passage.email } });
}
