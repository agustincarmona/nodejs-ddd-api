import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoConnection } from '../../src/infrastructure/persistence/mongodb/connection/MongoConnection';

let mongoServer: MongoMemoryServer;

export const setupTestDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  const mongoConnection = MongoConnection.getInstance();
  await mongoConnection.connect(uri, 'test-db');
};

export const teardownTestDatabase = async () => {
  const mongoConnection = MongoConnection.getInstance();
  await mongoConnection.disconnect();
  await mongoServer.stop();
};

export const clearDatabase = async () => {
  const mongoConnection = MongoConnection.getInstance();
  const db = mongoConnection.getDatabase();
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};
