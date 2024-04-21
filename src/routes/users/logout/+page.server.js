import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	cookies.delete('psg_auth_token', { path: '/' });
	throw redirect(302, '/');
}
