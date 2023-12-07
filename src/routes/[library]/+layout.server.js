import { findOr404 } from '$lib/serverHelpers.js';
import { library } from '$lib/db.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, url, locals }) {
	const library_obj = await findOr404(library, {
		where: {
			slug: params.library
		}
	});

	// Authenticate user - all pages under /[library]/* require authentication
	if (!locals.user.signedIn) {
		throw redirect(302, `/users/login?next=${url.toString()}`);
	}

	const subRoute = url.pathname.split('/')[2];
	const admin = library_obj.administrator_id === locals.user.id || locals.user.id === 1;
	// Check that the signed in user is the administrator
	if (subRoute && subRoute !== 'public' && !admin) {
		throw error(403, 'Not Authorized');
	}

	return {
		user: {
			...locals.user,
			admin
		},
		library_name: library_obj.name
	};
}
