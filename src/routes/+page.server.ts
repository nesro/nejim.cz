import _ from 'lodash';
import { fastsDb } from '../lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit/types/internal';
import { ObjectId } from 'mongodb';

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
            return fail(403);
        }

        const data = await event.request.formData();

        const fromTs = Number.parseInt(data.get('start-fast-at-timestamp') as string);
        const from = new Date(fromTs);
        const goal = Number.parseInt(data.get('start-fast-goal') as string);

        const mood = Number.parseInt(data.get('mood') as string);

        if (isNaN(from.getTime())) {
            return fail(400, { from, incorrect: true });
        }

        // console.log('fast-start:', { fromTs, from, utc: from.toISOString() });
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
            return fail(403);
        }

        const data = await event.request.formData();
        const toTs = Number.parseInt(data.get('end-fast-at-timestamp') as string);
        const to = new Date(toTs);

        if (isNaN(to.getTime())) {
            return fail(400, { incorrect: true });
        }

        // find active fast

        const activeFast = await fastsDb.getActiveFast(event.locals.user._id);
        if (!activeFast) {
            return fail(400, { reason: 'no active fast to end', incorrect: true });
        }

        const updateResult = await fastsDb.update({ ...activeFast, to, toTs });

        // TODO: test if it is ok
        console.log({ updateResult });

        return { success: true };
    },

    'edit-fast': async (event) => {
        if (!event.locals.user._id) {
            return fail(403);
        }

        const data = await event.request.formData();

        const fastId = new ObjectId(data.get('edit-fast-id') as string);
        if (!fastId || !ObjectId.isValid(fastId)) {
            return fail(400);
        }

        const fastToEdit = await fastsDb.findOne({ _id: fastId });
        if (!fastToEdit) {
            return fail(400, { reason: 'no fast to edit found', incorrect: true });
        }
        if (!fastToEdit.userId.equals(event.locals.user._id)) {
            return fail(403);
        }

        fastToEdit.fromTs = Number.parseInt(data.get('edit-fast-from-timestamp') as string);
        fastToEdit.from = new Date(fastToEdit.fromTs);
        fastToEdit.toTs = Number.parseInt(data.get('edit-fast-to-timestamp') as string);
        fastToEdit.to = new Date(fastToEdit.toTs);

        if (isNaN(fastToEdit.from.getTime()) || isNaN(fastToEdit.to.getTime())) {
            return fail(400, { incorrect: true });
        }

        const updateResult = await fastsDb.update(fastToEdit);

        // TODO: test if it is ok
        console.log({ updateResult });

        return { success: true };
    },

    'change-start-active-fast': async (event) => {
        if (!event.locals.user._id) {
            return fail(403);
        }

        const data = await event.request.formData();

        const fastId = new ObjectId(data.get('edit-fast-id') as string);
        if (!fastId || !ObjectId.isValid(fastId)) {
            return fail(400);
        }

        const fastToEdit = await fastsDb.findOne({ _id: fastId });
        if (!fastToEdit) {
            return fail(400, { reason: 'no fast to edit found', incorrect: true });
        }
        if (!fastToEdit.userId.equals(event.locals.user._id)) {
            return fail(403);
        }

        fastToEdit.fromTs = Number.parseInt(
            data.get('change-start-active-fast-at-timestamp') as string,
        );
        fastToEdit.from = new Date(fastToEdit.fromTs);

        if (isNaN(fastToEdit.from.getTime())) {
            return fail(400, { incorrect: true });
        }

        const updateResult = await fastsDb.update(fastToEdit);

        // TODO: test if it is ok
        console.log({ updateResult });

        return { success: true };
    },
};
