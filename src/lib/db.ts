import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || process.env.MONGODB_URI;
export const MONGODB_DB = import.meta.env.VITE_MONGODB_DB || process.env.MONGODB_DB;

if (!MONGODB_URI) {
	throw new Error('Please define the mongoURI property inside config/default.json');
}

if (!MONGODB_DB) {
	throw new Error('Please define the mongoDB property inside config/default.json');
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
