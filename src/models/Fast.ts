import type { ObjectId } from 'mongodb';

export default class Fast {
	constructor(
		public userId: ObjectId,
		public from: string,
		public to?: string,
		public id?: ObjectId
	) {}
}
