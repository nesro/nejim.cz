import { ObjectId } from 'mongodb';
import { getCollection } from '$lib/db';

export async function get({ locals }): Promise<unknown> {
    // console.log('activeFasts.json.ts', { locals });

    const activeFasts = await (
        await getCollection('fasts')
    )
        .find({ userId: { $exists: true }, to: { $exists: false } })
        .sort({ $natural: -1 })
        .toArray();

    const activeUserIds = activeFasts.map((fast) => new ObjectId(fast.userId));

    // console.log({ activeUserIds });

    const activeUsers = await (await getCollection('users'))
        .find({ _id: { $in: activeUserIds } } /*, { projection: { picture: 1 } }*/)
        .toArray();

    activeUsers.forEach((user) => {
        user.fastingFrom = activeFasts.find((fast) => fast.userId === user._id.toHexString()).from;
    });

    // console.log({ activeUserIds }, { activeFasts }, { activeUsers });

    return { body: activeUsers };
}
