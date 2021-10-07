// import type { Request } from '@sveltejs/kit';
// import type { Locals } from '$lib/types';
import { getCollection } from '$lib/db';
import * as cookie from 'cookie';
import { OAuth2Client, OAuth2ClientOptions, VerifyIdTokenOptions } from 'google-auth-library';
// import type { Db } from 'mongodb';
// import type User from '../models/User';

// TODO
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const client = new OAuth2Client({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET
} as OAuth2ClientOptions);

export async function post({ locals, body }): Promise<unknown> {
	try {
		const items = [...body.entries()];

		console.log('nejim.cz/google-login', { locals }, { body }, { items });

		const ticket = await client.verifyIdToken({
			idToken: items[0][1],
			audience: CLIENT_ID
		} as VerifyIdTokenOptions);

		const payload = ticket.getPayload();
		const googleId = payload['sub'];

		let user = await (await getCollection('users')).findOne({ googleId });

		if (!user) {
			user = {
				googleId,
				name: payload['name'],
				email: payload['email'],
				picture: payload['picture']
			};
			const insertResult = await (await getCollection('users')).insertOne(user);
			user._id = insertResult.insertedId;
		}

		console.log(
			`user email=${user.email}, id=${user._id}, googleId=${
				user.googleId
			}, payload=${JSON.stringify(payload)}`
		);

		const sidCookie = await (
			await getCollection('cookies')
		).insertOne({
			userId: user._id.toString()
		});

		console.log('nejim.cz/google-login', { locals }, { body }, { items });

		return {
			status: 200,
			headers: {
				'Set-Cookie': cookie.serialize('nejim_sid', sidCookie.insertedId.toString(), {
					httpOnly: true,
					maxAge: 60 * 60 * 24 * 365,
					sameSite: 'strict',
					path: '/'
				}),
				Location: '/profile'
			}
		};
	} catch (e) {
		console.error('google error', e);
	}
}
