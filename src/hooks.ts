import cookie from 'cookie';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';
import { minify } from 'html-minifier';
import { getCollection } from '$lib/db';
import { prerendering } from '$app/env';
import type User from './models/User';
import type { Handle } from '@sveltejs/kit';

const minification_options = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    decodeEntities: true,
    html5: true,
    ignoreCustomComments: [/^#/],
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
};

export const handle: Handle = async ({ request, resolve }) => {
    const cookies = cookie.parse(request.headers.cookie || '');
    request.locals.userid = cookies.userid || uuid();

    // console.log('COOKIES', request.headers.cookie);
    const nejimSid = cookies['nejim_sid'];
    const session = await (await getCollection('cookies')).findOne({ _id: new ObjectId(nejimSid) });

    if (session) {
        request.locals.userId = session.userId;

        const user = await (
            await getCollection('users')
        ).findOne({ _id: new ObjectId(session.userId) });

        request.locals.user = _.pick(user, ['name', 'email', 'picture']);
    }

    // console.log('NESRO DEBUG SES', { session }, { nejimSid });

    // TODO https://github.com/sveltejs/kit/issues/1046
    if (request.query.has('_method')) {
        request.method = request.query.get('_method').toUpperCase();
    }

    const response = await resolve(request);

    if (!cookies.userid) {
        // if this is the first time the user has visited this app,
        // set a cookie so that we recognize them when they return
        response.headers['set-cookie'] = cookie.serialize('userid', request.locals.userid, {
            path: '/',
            httpOnly: true,
        });
    }

    if (prerendering && response.headers['content-type'] === 'text/html') {
        response.body = minify(response.body, minification_options);
    }

    return response;
};

// Sets session on client-side
// try console logging session in routes' load({ session }) functions
export const getSession = async (request: {
    locals: { userId: string; user: User };
}): Promise<any> => {
    return {
        userId: request.locals.userId,
        user: request.locals.user,
    };
};
