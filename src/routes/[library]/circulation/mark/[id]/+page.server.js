import { findOr404 } from '$lib/serverHelpers.js';
import { mark } from '$lib/db.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const mark_obj = await findOr404(mark, { where: { id: +params.id } });
	throw redirect(
		303,
		`/${params.library}/circulation/borrow/${mark_obj.item_id}?user=${mark_obj.user_id}`
	);
}
