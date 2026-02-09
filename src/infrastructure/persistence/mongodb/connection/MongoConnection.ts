import { MongoClient, Db } from 'mongodb';
import { DatabaseNotConnectedException } from '../../../exceptions';

export class MongoConnection {
  private static instance: MongoConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(uri: string, dbName: string): Promise<void> {
    try {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
      console.log('✅ Conectado a MongoDB');
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error);
      throw error;
    }
  }

  public getDatabase(): Db {
    if (!this.db) {
      throw new DatabaseNotConnectedException();
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('✅ Desconectado de MongoDB');
    }
  }
}
