import { MongoClient, Db } from 'mongodb';
import { env } from './env.js';

let client: MongoClient | null = null;
let db: Db | null = null;

export function isRemoteMongoUri(uri: string): boolean {
  return (
    uri.includes('mongodb+srv://') ||
    (!uri.includes('localhost') && !uri.includes('127.0.0.1'))
  );
}

export async function connectToDatabase(customUri?: string): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) {
    return { client, db };
  }

  const uri = customUri || env.MONGODB_URI;
  const isRemote = isRemoteMongoUri(uri);

  // In production or when connecting to MongoDB Atlas, use an adequate connection timeout (10s)
  // In local test/development with localhost, use a short timeout (2s) for rapid fallback
  const timeoutMs = isRemote || env.NODE_ENV === 'production' ? 10000 : 2000;

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: timeoutMs,
    connectTimeoutMS: timeoutMs,
  });

  await client.connect();

  // If URI includes a database name in the path, use it; otherwise default to 'grabadoshub'
  db = client.db();

  console.log(`✅ Conexión establecida con MongoDB (${isRemote ? 'Remoto / Atlas' : 'Local'})`);
  return { client, db };
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Base de datos no inicializada. Debe invocar connectToDatabase() previamente.');
  }
  return db;
}

export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error('MongoClient no inicializado. Debe invocar connectToDatabase() previamente.');
  }
  return client;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Conexión con MongoDB cerrada ordenadamente.');
  }
}
