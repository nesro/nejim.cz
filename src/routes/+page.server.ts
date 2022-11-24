import _ from 'lodash';

import { getCollection, fastsDb } from '../lib/server/db';
import { invalid } from '@sveltejs/kit';

import type { Actions, ServerLoad } from '@sveltejs/kit/types/internal';

import type { ObjectId } from 'mongodb';

const getFasts = async (userId: ObjectId) => {
    const body = await (await getCollection('fasts'))
        .find({ userId })
        .sort({ $natural: -1 })
        .toArray();
    return body;
};

export const load: ServerLoad = async (event) => {
    // const { cookies } = event;

    if (!event.locals.user?._id) {
        return {};
    }
    console.error('user._id=', event.locals.user._id);

    const userEmail = event.locals?.user?.email;

    // debugger;
    console.error(`ServerLoad, email=${userEmail}`);

    const fasts = await fastsDb.findByUserId(event.locals.user._id);

    // console.error('ServerLoad cookies=', cookies.serialize());
    console.error('fasts:', fasts);

    // const game = new Game(cookies.get('sverdle'));

    return {
        user: _.pick(event.locals.user, ['picture', 'name']),
        raz: 'dva',
        fasts: JSON.stringify(fasts),
    };
};

export const actions: Actions = {
    'fast-start': async (event) => {
        if (!event.locals.user._id) {
            return invalid(403);
        }

        const data = await event.request.formData();

        const fromTs = Number.parseInt(data.get('start-fast-at-timestamp') as string);
        const from = new Date(fromTs);
        const goal = Number.parseInt(data.get('start-fast-goal') as string);

        const mood = Number.parseInt(data.get('mood') as string);

        if (isNaN(from.getTime())) {
            return invalid(400, { from, incorrect: true });
        }

        console.log('fast-start:', { fromTs, from, utc: from.toISOString() });
        fastsDb.insertOne({
            userId: event.locals.user._id,
            createdAt: new Date(),
            fromTs,
            from,
            goal,
            mood,
            // ...(!!to && { to }),
        });

        return { success: true };
    },

    'end-fast': async (event) => {
        if (!event.locals.user._id) {
            return invalid(403);
        }

        const data = await event.request.formData();
        const date = data.get('end-fast-at-date') as string;
        const time = data.get('end-fast-at-time') as string;

        const to = new Date(`${date}T${time}`);

        if (isNaN(to.getTime())) {
            return invalid(400, { to, incorrect: true });
        }

        // find active fast

        const activeFast = await fastsDb.getActiveFast(event.locals.user._id);
        if (!activeFast) {
            return invalid(40, { reason: 'no active fast to end', incorrect: true });
        }

        const updateResult = await fastsDb.update({ ...activeFast, to });
        console.log({ updateResult });

        return { success: true };
    },
};
