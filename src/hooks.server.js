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
			},
			include: { settings: true }
		});
		const admin = library_obj.administrator_id === user.id || user.id === 1 || user.email_address === "pranav.pooruli@gmail.com";

		if (subRoute !== 'public' && !admin) {
			console.log(user);
			throw error(403, 'Not Authorized');
		}

		event.locals.library = library_obj;
		user.admin = admin;
	}
	event.locals.user = user;

	const response = await resolve(event);
	return response;
}
