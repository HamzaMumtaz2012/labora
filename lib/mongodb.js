
import { MongoClient } from "mongodb";

let clientPromise;

export default function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI. Configure it in .env.local.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }

    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }

  return clientPromise;
}
