import Passage from '@passageidentity/passage-node';
import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
import { PASSAGE_API_KEY } from '$env/static/private';

import { jwtVerify, importJWK } from 'jose';

import { user } from '$lib/db.js';
import { date } from '$lib/helpers.js';

const JWK = {
	e: 'AQAB',
	kid: 'AZwX4SDhosfhwligUHOb8jre',
	kty: 'RSA',
	n: 'yagi6GQJbwB-5TcV0lpmGee36xEsUBAHiVf_LsslZPmPMvqHtHgUitQ8QxokrB2mUA23V4MVPzg-quTGe9GPy8HRXdGCaL0P10WB3h-Lwm-OUSW1ockqdc6NlX0n9cv7JDJEkaCW5iAHrsbYFD-ytyr4moUbakebMggYX3ZVhsQNKJeQ2YywrPzHjRzjHGaEl8pLaOGs2sv51mtxZjBAXkdJSA0Fss8mjLH2NgBaygKry-c7cd5zM4aGxHh_-_IMv7MTL2tDzpv-JpTop14yNxBxtGVub2GWJPYzceFQUwK2ShsVbMmNTLpuSZEyyXaeoTJBc5f4t97W9bC5_vRVkQ',
	use: 'sig'
};
const passage = new Passage({ appID: PUBLIC_PASSAGE_APP_ID, apiKey: PASSAGE_API_KEY });

export async function getPassageId(auth_token) {
	const SECRET = await importJWK(JWK, 'RS256');
	let {
		payload: { sub: passage_id }
	} = await jwtVerify(auth_token, SECRET);
	return passage_id;
}

export async function getCurrentUser(auth_token) {
	if (!auth_token) {
		return null;
	}
	const passage_id = await getPassageId(auth_token);
	const user_obj = await user.findUnique({
		where: { passage_id },
		cacheStrategy: { swr: 6000, ttl: 6000 }
	});

	return user_obj;
}

export async function storeUserData(passage_id) {
	const {
		email,
		id,
		phone,
		user_metadata: { name, gender, about, date_of_birth }
	} = await passage.user.get(passage_id);

	const userDetails = {
		email_address: email,
		phone_number: phone,
		passage_id: id,
		name,
		gender: gender === 'M' ? 'M' : 'F',
		about,
		date_of_birth: date(date_of_birth, false)
	};

	// Weird way to set up passage ID, but until in prod, works.
	await user.upsert({
		where: { email_address: email },
		update: userDetails,
		create: userDetails
	});
}
