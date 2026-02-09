import { Collection, ObjectId } from 'mongodb';
import { Driver } from '../../../../domain/entities/Driver';
import { DriverRepository } from '../../../../domain/repositories/DriverRepository';
import { MongoConnection } from '../connection/MongoConnection';

interface DriverDocument {
  _id?: ObjectId;
  id: string;
  nombre: string;
  apellido: string;
  licencia: string;
  telefono: string;
  email: string;
  fechaNacimiento: Date;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export class MongoDriverRepository implements DriverRepository {
  private collection: Collection<DriverDocument>;

  constructor() {
    const db = MongoConnection.getInstance().getDatabase();
    this.collection = db.collection<DriverDocument>('conductores');
  }

  private toDocument(driver: Driver): DriverDocument {
    return {
      id: driver.id,
      nombre: driver.nombre,
      apellido: driver.apellido,
      licencia: driver.licencia,
      telefono: driver.telefono,
      email: driver.email,
      fechaNacimiento: driver.fechaNacimiento,
      activo: driver.activo,
      fechaCreacion: driver.fechaCreacion,
      fechaActualizacion: driver.fechaActualizacion,
    };
  }

  private toEntity(document: DriverDocument): Driver {
    return new Driver(
      document.id,
      document.nombre,
      document.apellido,
      document.licencia,
      document.telefono,
      document.email,
      document.fechaNacimiento,
      document.activo,
      document.fechaCreacion,
      document.fechaActualizacion
    );
  }

  async save(driver: Driver): Promise<Driver> {
    const document = this.toDocument(driver);
    await this.collection.insertOne(document);
    return driver;
  }

  async findById(id: string): Promise<Driver | null> {
    const document = await this.collection.findOne({ id });
    return document ? this.toEntity(document) : null;
  }

  async findAll(): Promise<Driver[]> {
    const documents = await this.collection.find({}).toArray();
    return documents.map((doc) => this.toEntity(doc));
  }

  async update(id: string, driver: Driver): Promise<Driver | null> {
    const document = this.toDocument(driver);
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: document },
      { returnDocument: 'after' }
    );
    
    return result ? this.toEntity(result) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async findByLicencia(licencia: string): Promise<Driver | null> {
    const document = await this.collection.findOne({ licencia });
    return document ? this.toEntity(document) : null;
  }
}
