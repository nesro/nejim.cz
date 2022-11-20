import type { ObjectId } from 'mongodb';

export default class User {
    constructor(
        public name: string,
        public email: string,
        public picture: string,
        public googleId: string,
        public _id?: ObjectId,
    ) {}
}
