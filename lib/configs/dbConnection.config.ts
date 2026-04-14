import mongoose from "mongoose";
import { MONGO_URI } from "./environment.config";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalWithCache = global as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalWithCache.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalWithCache.mongooseCache = cache;

export const connectDB = async () => {
  console.log("MONGO_URI----------", MONGO_URI);

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};
