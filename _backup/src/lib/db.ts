import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
// import sanitize from 'mongo-sanitize';
// import type User from '../models/User';

export const MONGODB_URI = (import.meta.env.VITE_MONGODB_URI ?? process.env.MONGODB_URI) as string;
export const MONGODB_DB = (import.meta.env.VITE_MONGODB_DB ?? process.env.MONGODB_DB) as string;

if (!MONGODB_URI) {
	throw new Error('Please define MONGODB_URI');
}

if (!MONGODB_DB) {
	throw new Error('Please define MONGODB_DB');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
	cached = global.mongo = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true
		} as MongoClientOptions;

		cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
			return {
				client,
				db: client.db(MONGODB_DB)
			};
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export const db = async (): Promise<Db> => {
	const dbConnection = await connectToDatabase();
	return dbConnection.db;
};

export const getCollection = async (collectionName: string): Promise<Collection> => {
	const dbConnection = await connectToDatabase();
	return dbConnection.db.collection(collectionName);
};

// export const getNextId = async (sequenceName: string): Promise<number> => {
// 	const dbConnection = await connectToDatabase();
// 	const db: Db = dbConnection.db;

// 	const sequenceDocument = await db
// 		.collection('counter')
// 		.findOneAndUpdate(
// 			{ _id: sequenceName },
// 			{ $inc: { sequence_value: 1 } },
// 			{ returnDocument: 'after', upsert: true }
// 		);
// 	return sequenceDocument.value.sequence_value;
// };

// export const users = {
// 	// { [key: string]: string }
// 	findOne: async (query: Filter<User>): Promise<User> => {
// 		const conn = await connectToDatabase();
// 		return await conn.db.collection('users').findOne(query as Filter<User>);
// 	},
// 	insertOne: async (user: User): Promise<User> => {
// 		const conn = await connectToDatabase();
// 		const result = await conn.db.collection('users').insertOne(user);
// 		return { ...user, id: result.insertedId };
// 	}
// };

// export const cookies = {
//     findOne: async (query: { [key: string]: string }): Promise<Cookie> => {
// 		const conn = await connectToDatabase();
// 		return conn.db.collection('users').findOne(sanitize(query));
// 	},
// 	insertOne: async (user: User): Promise<User> => {
// 		const conn = await connectToDatabase();
// 		return conn.db.collection('users').insertOne(user);
// 	}
// }
