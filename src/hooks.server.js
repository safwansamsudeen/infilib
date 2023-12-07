import { getCurrentUser } from '$lib/auth.js';

export function handleError({ error }) {
	console.log(error);
	return {
		message: 'Whoops!',
		code: error?.code ?? 'UNKNOWN'
	};
}

export async function handle({ event, resolve }) {
	console.time('Handle');
	console.time('Auth');
	const user_obj = await getCurrentUser(event.cookies.get('psg_auth_token'));
	event.locals.user = {
		signedIn: !!user_obj,
		email_address: user_obj?.email_address || '',
		id: user_obj?.id,
		passage_id: user_obj?.passage_id
	};
	console.timeEnd('Auth');
	const response = await resolve(event);
	console.timeEnd('Handle');
	return response;
}
