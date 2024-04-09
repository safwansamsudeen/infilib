export function load({ locals }) {
    return {
        user: locals.user,
        library: locals.library
    };
}
