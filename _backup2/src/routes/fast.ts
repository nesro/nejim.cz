import { getCollection } from '$lib/db';
import type { EndpointOutput } from '@sveltejs/kit';
import type { UpdateResult } from 'mongodb';

const parseDate = (date: string) => {
    const dateObject = new Date(date);

    console.log({ date }, { dateObject });

    if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid date');
    }

    return dateObject;
};

const stopActiveFast = async (userId: string, to: string): Promise<UpdateResult> =>
    await (
        await getCollection('fasts')
    ).updateOne(
        {
            userId: userId,
            to: { $exists: false },
        },
        {
            $set: { to: parseDate(to) },
        },
    );
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({
    locals,
    body,
}): // request: Request & { body: { currencies: string[] } },
Promise<EndpointOutput> {
    // const { locals, body } = request;

    if (!locals?.userId) {
        return {
            status: 401,
        };
    }

    // const items = [...body.entries()].map(([key, value]) => {

    try {
        body = JSON.parse(body);

        // const command = body.command;
        // const from = parseDate(body.get('from'));
        // const to = body.has('to') ? parseDate(body.get('to')) : null;

        if (!body.from && body.to) {
            stopActiveFast(locals.userId, body.to);
        } else {
            const from = parseDate(body.from);
            const to = body.to ? parseDate(body.to) : null;

            // save fast to database
            const fast = await (
                await getCollection('fasts')
            ).insertOne({
                userId: locals.userId,
                from,
                ...(!!to && { to }),
                createdAt: new Date(),
            });

            console.log('nejim.cz/fast', { locals }, { body }, { fast });
        }
    } catch (error) {
        console.error('ERROR nejim.cz/fast', { locals }, { body }, { error });
    }

    // return {
    //     status: 302,
    //     headers: {
    //         Location: '/',
    //     },
    // };

    return {
        status: 200,
        body: { status: 'ok2' },
    };
}
