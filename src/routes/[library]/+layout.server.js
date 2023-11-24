import { findOr404 } from '$lib/serverHelpers.js';
import { library } from '$lib/db.js';
import { getCurrentUser } from '$lib/auth.js';
import { error } from '@sveltejs/kit';

export async function load({ cookies, params, url }) {
	const library_obj = await findOr404(library, {
		where: {
			slug: params.library
		}
	});
	// Authenticate user - all pages under /[library]/* require authentication
	const user_obj = await getCurrentUser(cookies.get('psg_auth_token'));
	let data = {
		user: {
			signedIn: true,
			email_address: user_obj?.email_address || '',
			id: user_obj?.id,
			admin: library_obj.administrator_id === user_obj?.id
		},
		library_name: library_obj.name
	};
	const subRoute = url.pathname.split('/')[2];
	// Check that the signed in user is the administrator
	if (subRoute && subRoute !== 'public' && !data.user.admin) {
		throw error(403, 'Not Authorized');
	}
	return data;
}
