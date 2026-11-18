import { MongoClient, Db } from 'mongodb';
import { env } from './env.js';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(customUri?: string): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  const uri = customUri || env.MONGODB_URI;
  client = new MongoClient(uri);
  await client.connect();

  // If URI includes a database name in the path, use it; otherwise default to 'grabadoshub'
  db = client.db();

  console.log('✅ Connected to MongoDB successfully');
  return { client, db };
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error('MongoClient not initialized. Call connectToDatabase() first.');
  }
  return client;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}
