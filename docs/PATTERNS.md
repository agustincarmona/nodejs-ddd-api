# Patrones de Código

Ejemplos completos de los patrones implementados en el proyecto.

## Índice
- [Entidades](#entidades)
- [Repositorios](#repositorios)
- [Casos de Uso](#casos-de-uso)
- [DTOs](#dtos)
- [Excepciones](#excepciones)
- [Controllers](#controllers)
- [Routes](#routes)
- [Tests](#tests)

---

## Entidades

Las entidades del dominio encapsulan lógica de negocio y validaciones.

### Estructura Básica

```typescript
// src/domain/entities/Driver.ts
import { v7 as uuidv7 } from 'uuid';
import { ValidationException } from '../exceptions';

export class Driver {
  // Constructor con readonly properties
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly licencia: string,
    public readonly telefono: string,
    public readonly email: string,
    public readonly fechaNacimiento: Date,
    public readonly activo: boolean = true,
    public readonly fechaCreacion: Date = new Date(),
    public readonly fechaActualizacion: Date = new Date()
  ) {
    this.validate();
  }

  // Validaciones en el constructor
  private validate(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new ValidationException('El nombre es requerido', 'nombre');
    }
    if (!this.apellido || this.apellido.trim().length === 0) {
      throw new ValidationException('El apellido es requerido', 'apellido');
    }
    if (!this.licencia || this.licencia.trim().length === 0) {
      throw new ValidationException('La licencia es requerida', 'licencia');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new ValidationException('El email no es válido', 'email');
    }
    if (!this.telefono || this.telefono.trim().length === 0) {
      throw new ValidationException('El teléfono es requerido', 'telefono');
    }
    if (!this.fechaNacimiento) {
      throw new ValidationException('La fecha de nacimiento es requerida', 'fechaNacimiento');
    }
  }

  // Validación auxiliar
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Factory method para crear instancias
  public static create(
    nombre: string,
    apellido: string,
    licencia: string,
    telefono: string,
    email: string,
    fechaNacimiento: Date,
    id?: string
  ): Driver {
    return new Driver(
      id || this.generateId(),
      nombre,
      apellido,
      licencia,
      telefono,
      email,
      fechaNacimiento,
      true,  // activo por defecto
      new Date(),
      new Date()
    );
  }

  // Método para actualizar (inmutable)
  public update(data: Partial<{
    nombre: string;
    apellido: string;
    licencia: string;
    telefono: string;
    email: string;
    fechaNacimiento: Date;
    activo: boolean;
  }>): Driver {
    return new Driver(
      this.id,
      data.nombre ?? this.nombre,
      data.apellido ?? this.apellido,
      data.licencia ?? this.licencia,
      data.telefono ?? this.telefono,
      data.email ?? this.email,
      data.fechaNacimiento ?? this.fechaNacimiento,
      data.activo ?? this.activo,
      this.fechaCreacion,
      new Date()  // Nueva fecha de actualización
    );
  }

  // Serialización a JSON
  public toPlainObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      licencia: this.licencia,
      telefono: this.telefono,
      email: this.email,
      fechaNacimiento: this.fechaNacimiento,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }

  // Generación de ID único usando UUID v7
  private static generateId(): string {
    return uuidv7();
  }
}
```

### Ejemplo Completo: Entidad Vehicle

```typescript
// src/domain/entities/Vehicle.ts
import { ValidationException } from '../exceptions';

export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly plate: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number,
    public readonly capacity: number,
    public readonly activo: boolean = true,
    public readonly fechaCreacion: Date = new Date(),
    public readonly fechaActualizacion: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.plate || this.plate.trim().length === 0) {
      throw new ValidationException('La placa es requerida', 'plate');
    }
    if (!this.brand || this.brand.trim().length === 0) {
      throw new ValidationException('La marca es requerida', 'brand');
    }
    if (!this.model || this.model.trim().length === 0) {
      throw new ValidationException('El modelo es requerido', 'model');
    }
    if (this.year < 1900 || this.year > new Date().getFullYear() + 1) {
      throw new ValidationException('Año inválido', 'year');
    }
    if (this.capacity < 1 || this.capacity > 100) {
      throw new ValidationException('Capacidad inválida (1-100)', 'capacity');
    }
  }

  public static create(
    plate: string,
    brand: string,
    model: string,
    year: number,
    capacity: number,
    id?: string
  ): Vehicle {
    return new Vehicle(
      id || this.generateId(),
      plate.toUpperCase(),  // Normalizar placa
      brand,
      model,
      year,
      capacity,
      true,
      new Date(),
      new Date()
    );
  }

  public update(data: Partial<{
    plate: string;
    brand: string;
    model: string;
    year: number;
    capacity: number;
    activo: boolean;
  }>): Vehicle {
    return new Vehicle(
      this.id,
      data.plate ? data.plate.toUpperCase() : this.plate,
      data.brand ?? this.brand,
      data.model ?? this.model,
      data.year ?? this.year,
      data.capacity ?? this.capacity,
      data.activo ?? this.activo,
      this.fechaCreacion,
      new Date()
    );
  }

  public toPlainObject() {
    return {
      id: this.id,
      plate: this.plate,
      brand: this.brand,
      model: this.model,
      year: this.year,
      capacity: this.capacity,
      activo: this.activo,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }

  private static generateId(): string {
    return uuidv7();
  }
}
```

---

## Repositorios

### Interface de Repositorio

```typescript
// src/domain/repositories/VehicleRepository.ts
import { Vehicle } from '../entities/Vehicle';

export interface VehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findByPlate(plate: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  save(vehicle: Vehicle): Promise<Vehicle>;
  update(id: string, vehicle: Vehicle): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
}
```

### Implementación MongoDB

```typescript
// src/infrastructure/persistence/mongodb/repositories/MongoVehicleRepository.ts
import { MongoConnection } from '../connection/MongoConnection';
import { Vehicle } from '../../../../domain/entities/Vehicle';
import { VehicleRepository } from '../../../../domain/repositories/VehicleRepository';

export class MongoVehicleRepository implements VehicleRepository {
  private collectionName = 'vehicles';

  async findById(id: string): Promise<Vehicle | null> {
    const db = MongoConnection.getInstance().getDatabase();
    const doc = await db.collection(this.collectionName).findOne({ id });
    
    if (!doc) return null;
    
    return new Vehicle(
      doc.id,
      doc.plate,
      doc.brand,
      doc.model,
      doc.year,
      doc.capacity,
      doc.activo,
      new Date(doc.fechaCreacion),
      new Date(doc.fechaActualizacion)
    );
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const db = MongoConnection.getInstance().getDatabase();
    const doc = await db.collection(this.collectionName)
      .findOne({ plate: plate.toUpperCase() });
    
    if (!doc) return null;
    
    return new Vehicle(
      doc.id,
      doc.plate,
      doc.brand,
      doc.model,
      doc.year,
      doc.capacity,
      doc.activo,
      new Date(doc.fechaCreacion),
      new Date(doc.fechaActualizacion)
    );
  }

  async findAll(): Promise<Vehicle[]> {
    const db = MongoConnection.getInstance().getDatabase();
    const docs = await db.collection(this.collectionName).find().toArray();
    
    return docs.map(doc => new Vehicle(
      doc.id,
      doc.plate,
      doc.brand,
      doc.model,
      doc.year,
      doc.capacity,
      doc.activo,
      new Date(doc.fechaCreacion),
      new Date(doc.fechaActualizacion)
    ));
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const db = MongoConnection.getInstance().getDatabase();
    await db.collection(this.collectionName).insertOne(vehicle.toPlainObject());
    return vehicle;
  }

  async update(id: string, vehicle: Vehicle): Promise<Vehicle | null> {
    const db = MongoConnection.getInstance().getDatabase();
    const result = await db.collection(this.collectionName)
      .findOneAndUpdate(
        { id },
        { $set: vehicle.toPlainObject() },
        { returnDocument: 'after' }
      );
    
    if (!result.value) return null;
    
    return vehicle;
  }

  async delete(id: string): Promise<boolean> {
    const db = MongoConnection.getInstance().getDatabase();
    const result = await db.collection(this.collectionName).deleteOne({ id });
    return result.deletedCount > 0;
  }
}
```

---

## Casos de Uso

### Create Use Case

```typescript
// src/application/use-cases/vehicle/CreateVehicleUseCase.ts
import { Vehicle } from '../../../domain/entities/Vehicle';
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository';
import { DuplicatePlateException } from '../../../domain/exceptions/vehicle';
import { CreateVehicleDTO } from '../../dtos/vehicle';

export class CreateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(dto: CreateVehicleDTO): Promise<Vehicle> {
    // 1. Validar reglas de negocio
    const existingVehicle = await this.vehicleRepository.findByPlate(dto.plate);
    if (existingVehicle) {
      throw new DuplicatePlateException(dto.plate);
    }

    // 2. Crear entidad de dominio
    const vehicle = Vehicle.create(
      dto.plate,
      dto.brand,
      dto.model,
      dto.year,
      dto.capacity
    );

    // 3. Persistir
    return await this.vehicleRepository.save(vehicle);
  }
}
```

### Get Use Case

```typescript
// src/application/use-cases/vehicle/GetVehicleUseCase.ts
import { Vehicle } from '../../../domain/entities/Vehicle';
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository';
import { VehicleNotFoundException } from '../../../domain/exceptions/vehicle';

export class GetVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }
    return vehicle;
  }
}
```

### Update Use Case

```typescript
// src/application/use-cases/vehicle/UpdateVehicleUseCase.ts
import { Vehicle } from '../../../domain/entities/Vehicle';
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository';
import { 
  VehicleNotFoundException, 
  DuplicatePlateException,
  VehicleUpdateException
} from '../../../domain/exceptions/vehicle';
import { UpdateVehicleDTO } from '../../dtos/vehicle';

export class UpdateVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string, dto: UpdateVehicleDTO): Promise<Vehicle> {
    // 1. Verificar que existe
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new VehicleNotFoundException(id);
    }

    // 2. Si se actualiza la placa, verificar unicidad
    if (dto.plate && dto.plate !== existingVehicle.plate) {
      const vehicleWithPlate = await this.vehicleRepository.findByPlate(dto.plate);
      if (vehicleWithPlate) {
        throw new DuplicatePlateException(dto.plate);
      }
    }

    // 3. Actualizar entidad
    const updatedVehicle = existingVehicle.update(dto);
    
    // 4. Persistir
    const result = await this.vehicleRepository.update(id, updatedVehicle);
    if (!result) {
      throw new VehicleUpdateException(id);
    }

    return result;
  }
}
```

### Delete Use Case

```typescript
// src/application/use-cases/vehicle/DeleteVehicleUseCase.ts
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository';
import { 
  VehicleNotFoundException,
  VehicleDeleteException
} from '../../../domain/exceptions/vehicle';

export class DeleteVehicleUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Verificar que existe
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }

    // 2. Eliminar
    const deleted = await this.vehicleRepository.delete(id);
    if (!deleted) {
      throw new VehicleDeleteException(id);
    }
  }
}
```

### GetAll Use Case

```typescript
// src/application/use-cases/vehicle/GetAllVehiclesUseCase.ts
import { Vehicle } from '../../../domain/entities/Vehicle';
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository';

export class GetAllVehiclesUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(): Promise<Vehicle[]> {
    return await this.vehicleRepository.findAll();
  }
}
```

---

## DTOs

```typescript
// src/application/dtos/vehicle/CreateVehicleDTO.ts
export interface CreateVehicleDTO {
  plate: string;
  brand: string;
  model: string;
  year: number;
  capacity: number;
}

// src/application/dtos/vehicle/UpdateVehicleDTO.ts
export interface UpdateVehicleDTO {
  plate?: string;
  brand?: string;
  model?: string;
  year?: number;
  capacity?: number;
  activo?: boolean;
}

// src/application/dtos/vehicle/index.ts
export * from './CreateVehicleDTO';
export * from './UpdateVehicleDTO';
```

---

## Excepciones

### Excepción de Dominio

```typescript
// src/domain/exceptions/vehicle/DuplicatePlateException.ts
export class DuplicatePlateException extends Error {
  constructor(plate: string) {
    super(`Ya existe un vehículo con la placa: ${plate}`);
    this.name = 'DuplicatePlateException';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicatePlateException);
    }
  }
}

// src/domain/exceptions/vehicle/VehicleNotFoundException.ts
export class VehicleNotFoundException extends Error {
  constructor(id: string) {
    super(`Vehículo con ID ${id} no encontrado`);
    this.name = 'VehicleNotFoundException';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VehicleNotFoundException);
    }
  }
}

// src/domain/exceptions/vehicle/index.ts
export * from './DuplicatePlateException';
export * from './VehicleNotFoundException';
export * from './VehicleUpdateException';
export * from './VehicleDeleteException';
```

---

## Controllers

```typescript
// src/infrastructure/api/controllers/VehicleController.ts
import { Request, Response } from 'express';
import { CreateVehicleUseCase } from '../../../application/use-cases/vehicle/CreateVehicleUseCase';
import { GetVehicleUseCase } from '../../../application/use-cases/vehicle/GetVehicleUseCase';
import { GetAllVehiclesUseCase } from '../../../application/use-cases/vehicle/GetAllVehiclesUseCase';
import { UpdateVehicleUseCase } from '../../../application/use-cases/vehicle/UpdateVehicleUseCase';
import { DeleteVehicleUseCase } from '../../../application/use-cases/vehicle/DeleteVehicleUseCase';
import {
  DuplicatePlateException,
  VehicleNotFoundException,
  VehicleUpdateException,
  VehicleDeleteException,
  ValidationException
} from '../../../domain/exceptions';

export class VehicleController {
  constructor(
    private createVehicleUseCase: CreateVehicleUseCase,
    private getVehicleUseCase: GetVehicleUseCase,
    private getAllVehiclesUseCase: GetAllVehiclesUseCase,
    private updateVehicleUseCase: UpdateVehicleUseCase,
    private deleteVehicleUseCase: DeleteVehicleUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { plate, brand, model, year, capacity } = req.body;

      // Validación básica
      if (!plate || !brand || !model || !year || !capacity) {
        res.status(400).json({
          error: 'Todos los campos son requeridos',
          campos: ['plate', 'brand', 'model', 'year', 'capacity']
        });
        return;
      }

      const vehicle = await this.createVehicleUseCase.execute({
        plate,
        brand,
        model,
        year: parseInt(year),
        capacity: parseInt(capacity)
      });

      res.status(201).json(vehicle.toPlainObject());
    } catch (error) {
      if (error instanceof DuplicatePlateException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message, field: error.field });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vehicle = await this.getVehicleUseCase.execute(id);
      res.status(200).json(vehicle.toPlainObject());
    } catch (error) {
      if (error instanceof VehicleNotFoundException) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const vehicles = await this.getAllVehiclesUseCase.execute();
      res.status(200).json(vehicles.map(v => v.toPlainObject()));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const vehicle = await this.updateVehicleUseCase.execute(id, updateData);
      res.status(200).json(vehicle.toPlainObject());
    } catch (error) {
      if (error instanceof VehicleNotFoundException) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof DuplicatePlateException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message, field: error.field });
      } else if (error instanceof VehicleUpdateException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteVehicleUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof VehicleNotFoundException) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof VehicleDeleteException) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
}
```

---

## Routes

```typescript
// src/infrastructure/api/routes/vehicleRoutes.ts
import { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { CreateVehicleUseCase } from '../../../application/use-cases/vehicle/CreateVehicleUseCase';
import { GetVehicleUseCase } from '../../../application/use-cases/vehicle/GetVehicleUseCase';
import { GetAllVehiclesUseCase } from '../../../application/use-cases/vehicle/GetAllVehiclesUseCase';
import { UpdateVehicleUseCase } from '../../../application/use-cases/vehicle/UpdateVehicleUseCase';
import { DeleteVehicleUseCase } from '../../../application/use-cases/vehicle/DeleteVehicleUseCase';
import { MongoVehicleRepository } from '../../persistence/mongodb/repositories/MongoVehicleRepository';

const router = Router();

// Dependency injection
const vehicleRepository = new MongoVehicleRepository();
const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const getVehicleUseCase = new GetVehicleUseCase(vehicleRepository);
const getAllVehiclesUseCase = new GetAllVehiclesUseCase(vehicleRepository);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);

const vehicleController = new VehicleController(
  createVehicleUseCase,
  getVehicleUseCase,
  getAllVehiclesUseCase,
  updateVehicleUseCase,
  deleteVehicleUseCase
);

// Routes
router.post('/', (req, res) => vehicleController.create(req, res));
router.get('/', (req, res) => vehicleController.getAll(req, res));
router.get('/:id', (req, res) => vehicleController.getById(req, res));
router.put('/:id', (req, res) => vehicleController.update(req, res));
router.delete('/:id', (req, res) => vehicleController.delete(req, res));

export { router as vehicleRoutes };
```

---

## Tests

### Test de Integración

```typescript
// test/integration/api/vehicle.test.ts
import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../../src/infrastructure/api/app';
import { setupTestDatabase, teardownTestDatabase, clearDatabase } from '../../helpers/testDatabase';

describe('Vehicle API Integration Tests', () => {
  let app: Application;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/vehicles', () => {
    it('should create a new vehicle with valid data', async () => {
      const vehicleData = {
        plate: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        capacity: 4
      };

      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData)
        .expect(201);

      expect(response.body).toMatchObject({
        plate: 'ABC123',
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        capacity: vehicleData.capacity,
        activo: true,
      });
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 when plate is duplicated', async () => {
      const vehicleData = {
        plate: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        capacity: 4
      };

      await request(app).post('/api/vehicles').send(vehicleData).expect(201);

      const response = await request(app)
        .post('/api/vehicles')
        .send({ ...vehicleData, brand: 'Honda' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('placa');
    });
  });

  describe('GET /api/vehicles', () => {
    it('should return all vehicles', async () => {
      const vehicle1 = {
        plate: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        capacity: 4
      };
      const vehicle2 = {
        plate: 'XYZ789',
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        capacity: 5
      };

      await request(app).post('/api/vehicles').send(vehicle1);
      await request(app).post('/api/vehicles').send(vehicle2);

      const response = await request(app).get('/api/vehicles').expect(200);

      expect(response.body).toHaveLength(2);
    });
  });
});
```

---

## Checklist de Implementación

Al crear una nueva entidad, verificar:

- [ ] Entidad creada con validaciones
- [ ] Interface de repositorio definida
- [ ] Excepciones específicas creadas
- [ ] DTOs definidos
- [ ] 5 casos de uso implementados (Create, Get, GetAll, Update, Delete)
- [ ] Repositorio MongoDB implementado
- [ ] Controller creado
- [ ] Routes configuradas
- [ ] Tests de integración
- [ ] Archivos barrel (`index.ts`)
- [ ] Sin violaciones de arquitectura
- [ ] Documentación actualizada

---

**Referencias Adicionales:**
- [Arquitectura](ARCHITECTURE.md)
- [Guía de Desarrollo](DEVELOPMENT.md)
- [Testing](TESTING.md)
