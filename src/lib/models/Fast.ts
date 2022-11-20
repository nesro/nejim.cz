import type { ObjectId } from 'mongodb';

export default class Fast {
    constructor(
        public userId: ObjectId,
        public createdAt: Date,
        public from: Date,
        public to?: Date,
        public goal?: number,
        public _id?: ObjectId,
    ) {}
}
