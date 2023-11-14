import {  json } from '@sveltejs/kit';
import { getUserColumns } from '$lib/columns.js';
import { user } from '$lib/db.js';
import { parseProperties } from '$lib/validators.js';
import {findValue}from '$lib/helpers.js';

export async function PATCH({ request, params }) {
	const { id, property, value, type } = await request.json();

		let columns = await getUserColumns();
		if (Array.isArray(columns[0])) {
			columns = columns[0].concat(columns[1][type]?.map((obj) => ({ ...obj, type })) || []);
		}

		const check = parseProperties(
			{ id, [property]: value },
			[findValue(columns, 'id', 'id'), findValue(columns, property, 'id')],
			true
		);
		if (check) return { ...check, success: false, status_code: 400 };
		let column = findValue(columns, property);
		await user.update({
			where: {
				id: +id,
				subscriptions: { some: { slug: { equals: params.library } } } }
			,
				data: {
					[property]:
						column.type !== 'select'
							? value
							: {
									connectOrCreate: {
										where: {
											[column.opts.unpacking.value]: value.value || 0
										},
										create: {
											[column.opts.unpacking.value]: value.value,
											[column.opts.unpacking.label]: value.label
										}
									}
							  }
				}

		});
		return new json({
			success: true,
			status_code: 200
		});
}
