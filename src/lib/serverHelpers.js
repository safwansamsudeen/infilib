import { fail, json } from '@sveltejs/kit';
import { parseProperties } from '$lib/validators.js';
import { findValue } from '$lib/helpers.js';

export async function pojoData(request) {
	return Object.fromEntries(await request.formData());
}

export function patch(columnsFunc, model) {
	return async ({ request }) => {
		const { id, property, value, type } = await request.json();
		return await serverResponse(async () => {
			let columns = await columnsFunc();
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
			await model.update({
				where: { id: +id },
				data: {
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
				}
			});
		});
	};
}

export async function response(func, return_val, status_code = 200) {
	try {
		let result = await func();
		if (return_val === true) {
			return result;
		}
		return return_val || { success: true, status_code };
	} catch (error) {
		console.log(error);
		return fail(500, { success: false, error: error.message });
	}
}

export async function serverResponse(func, status_code = 200) {
	try {
		let res = await func();
		return new json({
			...res,
			success: res?.success ?? true,
			status_code: res?.status_code ?? status_code
		});
	} catch (error) {
		console.log(error);
		return new json({ success: false, status_code: 500, error });
	}
}
