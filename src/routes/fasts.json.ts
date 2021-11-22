// import * as api from '$lib/api';
import { getCollection } from '$lib/db';

export async function get({ locals }): Promise<unknown> {
    // console.log('fasts.json.ts', { locals });

    const body = await (await getCollection('fasts'))
        .find({ userId: locals.userId })
        .sort({ $natural: -1 })
        .toArray();

    return { body };
}
