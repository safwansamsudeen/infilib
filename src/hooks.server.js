import { getCurrentUser } from '$lib/auth';
import { findOr404 } from '$lib/helpers.js';
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
    console.time('auth')
    console.time('cookie')
    const user_obj = await getCurrentUser(event.cookies.get('psg_auth_token'));
    const user = {
        signedIn: !!user_obj,
        email_address: user_obj?.email_address || '',
        id: user_obj?.id,
        passage_id: user_obj?.passage_id
    };
    console.timeEnd('cookie')

    console.time('stuff')
    if (event.params.library) {
        if (!user.signedIn) {
            redirect(302, `/users/login?next=${event.url.toString()}`);
        }
        const subRoute = event.url.pathname.split('/')[2];
        console.time('finding lib')
        const library_obj = await findOr404(library, {
            where: {
                slug: event.params.library
            },
            include: { settings: true },
            cacheStrategy: { swr: 600, ttl: 600 },
        });
        console.timeEnd('finding lib')
        const admin = library_obj.administrator_id === user.id || user.id === 1 || user.email_address === "pranav.pooruli@gmail.com";

        if (subRoute !== 'public' && !admin) {
            console.log(user);
            error(403, 'Not Authorized');
        }

        event.locals.library = library_obj;
        user.admin = admin;
    }
    event.locals.user = user;
    console.timeEnd('stuff')

    console.timeEnd('auth')

    const response = await resolve(event);

    return response;
}
