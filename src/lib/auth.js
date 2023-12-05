import Passage from '@passageidentity/passage-node';
import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
import { PASSAGE_API_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { user } from '$lib/db.js';

export async function getCurrentUser(psg_auth_token, url) {
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
		const user_passage = await passage.user.get(userID);
		const user_obj = await user.findUnique({ where: { email_address: user_passage.email } });
		if (!user_obj) throw new Error('not found');
		return user_obj;
	} catch (error) {
		throw redirect(302, `/users/login?next=${url}`);
	}
}

export async function logout() {
	const passage = new Passage({ appID: PUBLIC_PASSAGE_APP_ID });
	const session = passage.session.getCurrentSession();
	await session.signOut();
}
