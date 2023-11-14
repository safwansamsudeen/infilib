import { mark } from '$lib/db.js';
import { getMarkColumns } from '$lib/columns.js';
import { date, standardizeSelects } from '$lib/helpers.js';

export async function load({ params }) {
	let marks = await mark.findMany({
		include: {
			item: true,
			user: true
		},
		where: { item: { library_slug: params.library } }
	});
	marks = marks.map(
		({
			comments,
			borrow_time,
			item: { id: book_id, title, call_no },
			user: { id: user_id, name }
		}) => ({
			comments,
			borrow_time: date(borrow_time, true, true),
			user: `${user_id} ${name}`,
			item: `${book_id} ${title}, ${call_no}`
		})
	);
	const markColumns = getMarkColumns();
	console.log(marks);
	return {
		columns: markColumns,
		marks
	};
}
