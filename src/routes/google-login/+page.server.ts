import { getCollection } from '../../lib/server/db';
import { redirect, invalid } from '@sveltejs/kit';
import {
    OAuth2Client,
    type OAuth2ClientOptions,
    type VerifyIdTokenOptions,
} from 'google-auth-library';

import type { Actions } from '@sveltejs/kit/types/internal';

// TODO
// https://developers.google.com/identity/gsi/web/guides/verify-google-id-token

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
} as OAuth2ClientOptions);

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();

        console.error('I have google data:', [...data]);

        const credential = data.get('credential') as string;
        // g_csrf_token is not used, yet

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: CLIENT_ID,
        } as VerifyIdTokenOptions);

        const payload = ticket.getPayload();

        if (!payload) {
            return invalid(400, { incorrect: true });
        }

        const googleId = payload['sub'];

        let user = await (await getCollection('users')).findOne({ googleId });

        if (!user) {
            const newUser = {
                googleId,
                name: payload['name'],
                email: payload['email'],
                picture: payload['picture'],
            };
            const insertResult = await (await getCollection('users')).insertOne(newUser);
            user = {
                ...newUser,
                _id: insertResult.insertedId,
            };
        }

        console.log(
            `user email=${user.email}, id=${user._id}, googleId=${
                user.googleId
            }, payload=${JSON.stringify(payload)}`,
        );

        const sidCookie = await (
            await getCollection('cookies')
        ).insertOne({
            userId: user._id.toString(),
        });

        // console.log('nejim.cz/google-login', { locals }, { body }, { items });

        event.cookies.set('nejim_sid', sidCookie.insertedId.toString(), {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'strict',
            path: '/',
        });

        return redirect(303, '/');
    },
};
