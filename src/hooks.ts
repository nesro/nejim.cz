import cookie from 'cookie';
import { connectToDatabase } from '$lib/db';
import { v4 as uuid } from '@lukeed/uuid';
import type { Handle } from '@sveltejs/kit';
import type { Db } from 'mongodb';

export const handle: Handle = async ({ request, resolve }) => {
	// Connecting to DB
	// All database code can only run inside async functions as it uses await
	const dbConnection = await connectToDatabase();
	const db: Db = dbConnection.db;
	const userSession = await db.collection('users').findOne({ email: 'nesro@nesro.cz' });
	console.log({ userSession });

	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.userid = cookies.userid || uuid();

	// TODO https://github.com/sveltejs/kit/issues/1046
	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	const response = await resolve(request);

	if (!cookies.userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers['set-cookie'] = cookie.serialize('userid', request.locals.userid, {
			path: '/',
			httpOnly: true
		});
	}

	return response;
};
