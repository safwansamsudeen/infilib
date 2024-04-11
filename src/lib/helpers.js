// import Input from '$lib/subcomponents/Input.svelte';
import dayjs from 'dayjs';
import { fail, json, error } from '@sveltejs/kit';


// https://stackoverflow.com/questions/13917150/javascript-convert-en-us-and-similar-locale-codes-to-human-readable-strings
const LANG_MAPPING = {
	ab: 'Abkhazian',
	aa: 'Afar',
	af: 'Afrikaans',
	ak: 'Akan',
	sq: 'Albanian',
	am: 'Amharic',
	ar: 'Arabic',
	an: 'Aragonese',
	hy: 'Armenian',
	as: 'Assamese',
	av: 'Avaric',
	ae: 'Avestan',
	ay: 'Aymara',
	az: 'Azerbaijani',
	bm: 'Bambara',
	ba: 'Bashkir',
	eu: 'Basque',
	be: 'Belarusian',
	bn: 'Bengali',
	bh: 'Bihari languages',
	bi: 'Bislama',
	nb: 'Norwegian Bokmål',
	bs: 'Bosnian',
	br: 'Breton',
	bg: 'Bulgarian',
	my: 'Burmese',
	es: 'Spanish',
	ca: 'Valencian',
	km: 'Central Khmer',
	ch: 'Chamorro',
	ce: 'Chechen',
	ny: 'Nyanja',
	zh: 'Chinese',
	za: 'Zhuang',
	cu: 'Old Slavonic',
	cv: 'Chuvash',
	kw: 'Cornish',
	co: 'Corsican',
	cr: 'Cree',
	hr: 'Croatian',
	cs: 'Czech',
	da: 'Danish',
	dv: 'Maldivian',
	nl: 'Flemish',
	dz: 'Dzongkha',
	en: 'English',
	eo: 'Esperanto',
	et: 'Estonian',
	ee: 'Ewe',
	fo: 'Faroese',
	fj: 'Fijian',
	fi: 'Finnish',
	fr: 'French',
	ff: 'Fulah',
	gd: 'Scottish Gaelic',
	gl: 'Galician',
	lg: 'Ganda',
	ka: 'Georgian',
	de: 'German',
	ki: 'Kikuyu',
	el: 'Greek, Modern (1453-)',
	kl: 'Kalaallisut',
	gn: 'Guarani',
	gu: 'Gujarati',
	ht: 'Haitian Creole',
	ha: 'Hausa',
	he: 'Hebrew',
	hz: 'Herero',
	hi: 'Hindi',
	ho: 'Hiri Motu',
	hu: 'Hungarian',
	is: 'Icelandic',
	io: 'Ido',
	ig: 'Igbo',
	id: 'Indonesian',
	ia: 'Interlingua (International Auxiliary Language Association)',
	ie: 'Occidental',
	iu: 'Inuktitut',
	ik: 'Inupiaq',
	ga: 'Irish',
	it: 'Italian',
	ja: 'Japanese',
	jv: 'Javanese',
	kn: 'Kannada',
	kr: 'Kanuri',
	ks: 'Kashmiri',
	kk: 'Kazakh',
	rw: 'Kinyarwanda',
	ky: 'Kyrgyz',
	kv: 'Komi',
	kg: 'Kongo',
	ko: 'Korean',
	kj: 'Kwanyama',
	ku: 'Kurdish',
	lo: 'Lao',
	la: 'Latin',
	lv: 'Latvian',
	lb: 'Luxembourgish',
	li: 'Limburgish',
	ln: 'Lingala',
	lt: 'Lithuanian',
	lu: 'Luba-Katanga',
	mk: 'Macedonian',
	mg: 'Malagasy',
	ms: 'Malay',
	ml: 'Malayalam',
	mt: 'Maltese',
	gv: 'Manx',
	mi: 'Maori',
	mr: 'Marathi',
	mh: 'Marshallese',
	ro: 'Romanian',
	mn: 'Mongolian',
	na: 'Nauru',
	nv: 'Navajo',
	nd: 'North Ndebele',
	nr: 'South Ndebele',
	ng: 'Ndonga',
	ne: 'Nepali',
	se: 'Northern Sami',
	no: 'Norwegian',
	nn: 'Nynorsk, Norwegian',
	ii: 'Sichuan Yi',
	oc: 'Occitan (post 1500)',
	oj: 'Ojibwa',
	or: 'Oriya',
	om: 'Oromo',
	os: 'Ossetic',
	pi: 'Pali',
	pa: 'Punjabi',
	ps: 'Pushto',
	fa: 'Persian',
	pl: 'Polish',
	pt: 'Portuguese',
	qu: 'Quechua',
	rm: 'Romansh',
	rn: 'Rundi',
	ru: 'Russian',
	sm: 'Samoan',
	sg: 'Sango',
	sa: 'Sanskrit',
	sc: 'Sardinian',
	sr: 'Serbian',
	sn: 'Shona',
	sd: 'Sindhi',
	si: 'Sinhalese',
	sk: 'Slovak',
	sl: 'Slovenian',
	so: 'Somali',
	st: 'Sotho, Southern',
	su: 'Sundanese',
	sw: 'Swahili',
	ss: 'Swati',
	sv: 'Swedish',
	tl: 'Tagalog',
	ty: 'Tahitian',
	tg: 'Tajik',
	ta: 'Tamil',
	tt: 'Tatar',
	te: 'Telugu',
	th: 'Thai',
	bo: 'Tibetan',
	ti: 'Tigrinya',
	to: 'Tonga (Tonga Islands)',
	ts: 'Tsonga',
	tn: 'Tswana',
	tr: 'Turkish',
	tk: 'Turkmen',
	tw: 'Twi',
	ug: 'Uyghur',
	uk: 'Ukrainian',
	ur: 'Urdu',
	uz: 'Uzbek',
	ve: 'Venda',
	vi: 'Vietnamese',
	vo: 'Volapük',
	wa: 'Walloon',
	cy: 'Welsh',
	fy: 'Western Frisian',
	wo: 'Wolof',
	xh: 'Xhosa',
	yi: 'Yiddish',
	yo: 'Yoruba',
	zu: 'Zulu'
};

export function capitalize(label) {
	return label
		.split('_')
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(' ');
}

export function setFormField(id, value) {
	document.getElementById(id).value = value || '';
}

export function findValue(array, key_value, key = 'id') {
	for (let obj of array) {
		if (obj[key] === key_value) {
			return obj;
		}
	}
}

export function setSelectField(id, options, new_value = [], multi = false) {
	let value = multi ? [] : {};
	let existing_options;

	// Add new value(s) to option list
	if (multi) {
		for (let sub_value of new_value) {
			existing_options = options.filter(({ name }) => name === sub_value);
			if (!existing_options.length) {
				options.push({ id: sub_value, name: sub_value });
				value.push({ id: sub_value, name: sub_value });
			} else {
				value.push(existing_options[0]);
			}
		}
	} else {
		existing_options = options.filter(({ name }) => name === new_value);
		if (!existing_options.length) {
			options.push({ id: new_value, name: new_value });
			value = { id: new_value, name: new_value };
		} else {
			value = existing_options[0];
		}
	}

	// Empty component
	document.querySelector(`#${id}-div`).innerHTML = '';

	// Rerender component
	new Input({
		target: document.querySelector(`#${id}-div`),
		props: {
			id: id,
			type: 'select',
			opts: { value, options, multiple: multi },
			important: true
		}
	});
}

export function date(value, to_str = true, time = false, format = 'YYYY-MM-DD') {
	if (!value) {
		return null;
	}
	if (to_str) {
		if (time) {
			return dayjs(value).format('YYYY-MM-DD HH:mm');
		}
		return dayjs(value).format(format);
	}
	return new Date(value);
}

export async function setBookDetails(isbn, publishers, authors, languages, categories, scanner) {
	scanner?.pause?.();
	let res = await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn);
	let item = (await res.json()).items[0];
	let volumeInfo = item.volumeInfo;
	//   Populate form fields with request data
	setFormField('title', volumeInfo.title);
	setFormField('subtitle', volumeInfo.subtitle);
	setFormField('no_of_pages', volumeInfo.pageCount);
	setFormField('remarks', volumeInfo.description);
	setFormField('publication_year', volumeInfo.publishedDate?.split('-')[0]);
	setFormField('purchase_price', item.saleInfo.listPrice?.amount);
	setFormField('purchase_details', item.saleInfo.listPrice?.buyLink);
	setFormField('isbn', isbn);

	setSelectField('publisher', publishers, volumeInfo.publisher);
	setSelectField('authors', authors, volumeInfo.authors, true);
	setSelectField('languages', languages, [LANG_MAPPING[volumeInfo.language]], true);
	setSelectField('categories', categories, volumeInfo.categories, true);
	return false;
}

export function flatten(records, key) {
	records.map((rec) => Object.entries(rec[key]).map(([id, value]) => (rec[id] = value)));
}

export function truncate(text, totalChars = 80, endChars = 20) {
	if (!text) return '';
	endChars = Math.min(endChars, totalChars);
	const start = text.slice(0, totalChars - endChars);
	const end = endChars > 0 ? text.slice(-endChars) : '';

	if (start.length + end.length < text.length) {
		return start + '…' + end;
	} else {
		return text;
	}
}

export function injectLibraryInSelect(data, library_slug) {
	if (Array.isArray(data.connectOrCreate)) {
		// Handle the case where the value is a list of objects
		return {
			connectOrCreate: data.connectOrCreate.map((item) => ({
				where: { library_slug_name: { library_slug, ...item.where } },
				create: {
					...item.create,
					library_slug
				}
			}))
		};
	} else {
		// Handle the case where the value is a single object
		return {
			connectOrCreate: {
				where: { library_slug_name: { library_slug, ...data.connectOrCreate.where } },
				create: {
					...data.connectOrCreate.create,
					library_slug
				}
			}
		};
	}
}

export function addDefaults(obj, { opts, ...data }) {
	if (data.type !== 'object') {
		return {
			...data,
			opts: {
				...opts,
				value: obj[data.id]
			}
		};
	} else {
		return {
			...data,
			columns: data.columns.map((col) => addDefaults(obj[data.id], col))
		};
	}
}

export function getUserSubscription(user_obj, library_slug) {
	return user_obj.subscriptions.find(
		({ type, active }) => type.library_slug === library_slug && active
	);
}


export async function findOr404(model, params) {
	let model_obj = await model.findUnique(params);
	if (model_obj === null) {
		error(404, 'Not Found');
	}
	return model_obj;
}

export async function response(func, return_val = false, status_code = 200) {
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

// Get a request form data as a normal JS object
export async function pojoData(request) {
	return Object.fromEntries(await request.formData());
}