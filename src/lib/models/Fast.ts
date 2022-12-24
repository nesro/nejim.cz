import type { ObjectId } from 'mongodb';

export default class Fast {
    constructor(
        public userId: ObjectId,
        public createdAt: Date,
        public fromTs: number,
        public from: Date,
        public toTs?: number,
        public to?: Date,
        public goal?: number,
        public mood?: number,
        public finishedPercent?: number,
        public _id?: ObjectId,

        public editFromTime?: string,
        public editFromDate?: string,
        public editFromTs?: number,
        public editToTime?: string,
        public editToDate?: string,
        public editToTs?: number,
    ) {}
}
