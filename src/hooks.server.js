import { getCurrentUser } from '$lib/auth.js';
import { findOr404 } from '$lib/serverHelpers.js';
import { library } from '$lib/db.js';
import { error, redirect } from '@sveltejs/kit';

export function handleError({ error }) {
	console.log(error);
	return {
		message: 'Whoops!',
		code: error?.code ?? 'UNKNOWN'
	};
}

export async function handle({ event, resolve }) {
	const user_obj = await getCurrentUser(event.cookies.get('psg_auth_token'));
	const user = {
		signedIn: !!user_obj,
		email_address: user_obj?.email_address || '',
		id: user_obj?.id,
		passage_id: user_obj?.passage_id
	};

	if (event.params.library) {
		if (!user.signedIn) {
			throw redirect(302, `/users/login?next=${event.url.toString()}`);
		}
		const subRoute = event.url.pathname.split('/')[2];
		const library_obj = await findOr404(library, {
			where: {
				slug: event.params.library
			}
		});
		const admin = true;

		if (subRoute !== 'public' && !admin) {
			throw error(403, 'Not Authorized');
		}
		console.log(subRoute, admin);

		event.locals.library_name = library_obj.name;
		user.admin = admin;
	}
	event.locals.user = user;

	const response = await resolve(event);
	return response;
}
