export async function load({ locals }) {
	return {
		user: locals.user,
		library_name: locals.library_name
	};
}
