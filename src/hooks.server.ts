// import { getCollection } from '$lib/server/db';

import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';
import { getCollection, users } from './lib/server/db';

import type { Handle } from '@sveltejs/kit';
import type User from './lib/models/User';

const loadUser = async (userId: string): Promise<User> => {
    // const user = await (await getCollection('users')).findOne({ _id: new ObjectId(userId) });

    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
        throw new Error('no user');
    }

    return user;
};

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.userId = event.cookies.get('userid') || uuid();

    const nejimSid = event.cookies.get('nejim_sid') ?? '628ba65841ab6b0084c76ab1';
    if (nejimSid) {
        const session = await (
            await getCollection('cookies')
        ).findOne({ _id: new ObjectId(nejimSid) });

        if (!session) {
            return await resolve(event);
        }

        event.locals.user = await loadUser(session.userId);
    }

    // console.log(`handle, email=${event.locals?.user?.email}`);
    const response = await resolve(event);
    response.headers.set('x-custom-header', 'potato');

    return response;
};
