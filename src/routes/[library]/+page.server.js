import { mark } from '$lib/db';
import { getMarkColumns } from '$lib/columns';
import { date } from '$lib/helpers';

export async function load({ params }) {
    let marks = await mark.findMany({
        include: {
            item: true,
            user: true
        },
        where: { item: { library_slug: params.library } },
        cacheStrategy: { swr: 600, ttl: 600 }
    });
    marks = marks.map(
        ({
            id,
            comments,
            borrow_time,
            item: { id: book_id, title, call_no },
            user: { id: user_id, name }
        }) => ({
            id,
            comments,
            borrow_time: date(borrow_time, true, true),
            user: `${user_id} ${name}`,
            item: `${book_id} ${title}, ${call_no}`
        })
    );
    const markColumns = getMarkColumns();
    return {
        columns: markColumns,
        marks
    };
}
