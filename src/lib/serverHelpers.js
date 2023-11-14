import { fail, json, error } from '@sveltejs/kit';
import { parseProperties } from '$lib/validators.js';
import { findValue } from '$lib/helpers.js';

export async function pojoData(request) {
	return Object.fromEntries(await request.formData());
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

export async function findOr404(model, params) {
	let model_obj = await model.findUnique(params);
	if (model_obj === null) {
		throw error(404, 'Not Found');
	}
	return model_obj;
}
