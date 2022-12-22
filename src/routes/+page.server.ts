import _ from 'lodash';
import { fastsDb } from '../lib/server/db';
import { invalid } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit/types/internal';

export const load: ServerLoad = async (event) => {
    if (!event.locals.user?._id) {
        return {};
    }

    console.error('user._id=', event.locals.user._id);
    const userEmail = event.locals?.user?.email;
    console.error(`ServerLoad, email=${userEmail}`);

    const fasts = await fastsDb.findByUserId(event.locals.user._id);

    return {
        user: _.pick(event.locals.user, ['picture', 'name']),
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
        });

        return { success: true };
    },

    'end-fast': async (event) => {
        if (!event.locals.user._id) {
            return invalid(403);
        }

        const data = await event.request.formData();
        const toTs = Number.parseInt(data.get('end-fast-at-timestamp') as string);
        const to = new Date(toTs);

        if (isNaN(to.getTime())) {
            return invalid(400, { incorrect: true });
        }

        // find active fast

        const activeFast = await fastsDb.getActiveFast(event.locals.user._id);
        if (!activeFast) {
            return invalid(400, { reason: 'no active fast to end', incorrect: true });
        }

        const updateResult = await fastsDb.update({ ...activeFast, to, toTs });

        // TODO: test if it is ok
        console.log({ updateResult });

        return { success: true };
    },
};
