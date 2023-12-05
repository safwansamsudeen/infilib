import { serverResponse } from '$lib/serverHelpers.js';
import { item } from '$lib/db.js';
import { getItemColumns } from '$lib/columns.js';
import { parseProperties } from '$lib/validators.js';
import { findValue } from '$lib/helpers.js';

export async function PATCH({ request, params }) {
	const { id, property, value, type } = await request.json();
	return await serverResponse(async () => {
		let [columns, others] = await getItemColumns(params.library);

		columns = columns.concat(others[type] | []);

		const check = parseProperties(
			{ id, [property]: value },
			[findValue(columns, 'id', 'id'), findValue(columns, property, 'id')],
			true
		);
		if (check) return { ...check, success: false, status_code: 400 };

		let column = findValue(columns, property);
		let data = {
			[property]:
				column.type !== 'select'
					? value
					: {
							connectOrCreate:
								column.opts.multiple === true
									? value.map(({ value: subValue, label }) => {
											return {
												where: {
													[column.opts.unpacking.value]: subValue || 0,
													[column.opts.unpacking.label]: label
												},
												create: {
													[column.opts.unpacking.label]: label
												}
											};
									  })
									: {
											where: {
												[column.opts.unpacking.value]: value.value || 0
											},
											create: {
												[column.opts.unpacking.value]: value.value,
												[column.opts.unpacking.label]: value.label
											}
									  }
					  }
		};
		if (others[type]?.some(({ id: colId }) => colId === property)) {
			data = { [type]: { update: data } };
		}
		await item.update({
			where: { id: +id },
			data
		});
	});
}
