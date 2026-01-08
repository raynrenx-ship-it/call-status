import { MongoClient } from 'mongodb';

let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;
  global._mongoClient = cachedClient;
  global._mongoDb = cachedDb;

  return { client, db };
}
