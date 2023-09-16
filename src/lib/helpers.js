export function find(model, params = {}, { select = [], one = false } = {}) {
	console.log(model, params);
	let pms = one ? model.findUnique({ where: params }) : model.findMany({ where: params });
	return pms;
}

export async function pojoData(request) {
	return Object.fromEntries(await request.formData());
}

export async function response(func) {
	try {
		await func();
		return new Response(JSON.stringify({ type: 'success' }), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ type: 'error' }), { status: 400 });
	}
}

export function parseData(data, keys) {
	keys.forEach((key) => {
		if (key in data) {
			data[key] = JSON.parse(data[key] || '[]');
			if (Array.isArray(data[key])) {
				data[key] = data[key].map();
			}
		}
	});
}

export function listifyData(data, keys) {
	keys.forEach((key) => {
		if (key in data) {
			data[key] = data[key].split(',').map((x) => x.trim());
		}
	});
}

export function setFormField(id, value) {
	document.getElementById(id).value = value || '';
}
