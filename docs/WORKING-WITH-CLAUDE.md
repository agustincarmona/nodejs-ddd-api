# Trabajar con Claude Code AI

Esta guía está diseñada específicamente para optimizar la colaboración entre desarrolladores y Claude Code AI en este proyecto.

## Contexto del Proyecto para Claude

### Resumen Ejecutivo
**Proyecto**: API REST de Gestión de Transporte con arquitectura DDD  
**Stack**: TypeScript + Express + MongoDB  
**Estado**: CRUD de Drivers completamente funcional  
**Tests**: 29 tests pasando (94.54% coverage)  
**Arquitectura**: Clean Architecture de 3 capas (Domain, Application, Infrastructure)

### Tecnologías y Versiones
- **Node.js**: v18+
- **TypeScript**: 5.x
- **Express**: 4.x
- **MongoDB**: 6.x
- **Jest**: Testing framework con mongodb-memory-server
- **DDD**: Domain-Driven Design con Clean Architecture

### Estado de Implementación

#### ✅ Completamente Implementado
- Entidad `Driver` con validaciones completas
- CRUD completo de conductores (Create, Read, Update, Delete)
- Sistema de excepciones específicas organizadas por contexto
- DTOs organizados en `src/application/dtos/`
- Tests de integración exhaustivos (17 tests)
- Tests unitarios de controladores (12 tests)
- Validadores de dominio (EmailValidator)
- Repositorio MongoDB implementado
- API REST con Express
- Cobertura de tests: 94.54%

#### 🚧 Estructura Creada (Sin Implementar)
- Domain Services (carpeta existe, sin código)
- Domain Events (carpeta existe, sin código)
- Middleware personalizado (carpeta existe, sin código)

#### 📋 Por Implementar
- Entidad `Vehicle` (vehículos)
- Entidad `Route` (rutas)
- Paginación en listados
- Autenticación y autorización
- Logging y monitoreo

---

## Navegación Rápida del Código

### Tabla de Referencia Rápida

| Necesito... | Ve a... | Ejemplo de referencia |
|-------------|---------|----------------------|
| **Agregar nueva entidad** | `src/domain/entities/` | [Driver.ts](../src/domain/entities/Driver.ts) |
| **Crear caso de uso** | `src/application/use-cases/{entity}/` | [CreateDriverUseCase.ts](../src/application/use-cases/driver/CreateDriverUseCase.ts) |
| **Agregar endpoint REST** | `src/infrastructure/api/controllers/` + `routes/` | [DriverController.ts](../src/infrastructure/api/controllers/DriverController.ts) |
| **Crear excepción de dominio** | `src/domain/exceptions/{entity}/` | [DuplicateLicenseException.ts](../src/domain/exceptions/driver/DuplicateLicenseException.ts) |
| **Crear excepción de infraestructura** | `src/infrastructure/exceptions/{service}/` | [DatabaseNotConnectedException.ts](../src/infrastructure/exceptions/database/DatabaseNotConnectedException.ts) |
| **Agregar DTO** | `src/application/dtos/{entity}/` | [CreateDriverDTO.ts](../src/application/dtos/driver/CreateDriverDTO.ts) |
| **Implementar repositorio** | `src/infrastructure/persistence/mongodb/repositories/` | [MongoDriverRepository.ts](../src/infrastructure/persistence/mongodb/repositories/MongoDriverRepository.ts) |
| **Agregar interface de repositorio** | `src/domain/repositories/` | [DriverRepository.ts](../src/domain/repositories/DriverRepository.ts) |
| **Agregar test de integración** | `test/integration/api/` | [DriverController.test.ts](../test/integration/api/DriverController.test.ts) |
| **Agregar test unitario** | `test/unit/controllers/` | [DriverController.test.ts](../test/unit/controllers/DriverController.test.ts) |
| **Agregar validador de dominio** | `src/domain/validators/` | [EmailValidator.ts](../src/domain/validators/EmailValidator.ts) |

### Mapa de Archivos Clave

```
📁 Archivos más importantes para entender el proyecto:
├── src/domain/entities/Driver.ts              # Ejemplo perfecto de entidad
├── src/domain/validators/EmailValidator.ts    # Validador de dominio
├── src/application/use-cases/driver/
│   └── CreateDriverUseCase.ts                 # Patrón de caso de uso
├── src/infrastructure/api/controllers/
│   └── DriverController.ts                    # Patrón de controlador
├── src/infrastructure/persistence/mongodb/repositories/
│   └── MongoDriverRepository.ts               # Implementación de repositorio
├── src/domain/exceptions/README.md            # Catálogo de excepciones
├── test/integration/api/DriverController.test.ts  # Tests de integración
└── test/unit/controllers/DriverController.test.ts # Tests unitarios con mocks
```

---

## Prompts Útiles para Claude

### Comandos Efectivos

#### Crear Nueva Entidad
```
"Crea una nueva entidad Vehicle en src/domain/entities/ siguiendo exactamente 
el mismo patrón que Driver.ts. Incluye validaciones para:
- plate (placa única)
- brand (marca)
- model (modelo)
- year (año, mínimo 1900)
- capacity (capacidad de pasajeros)"
```

#### Agregar Funcionalidad
```
"Agrega validación de edad mínima (18 años) en la entidad Driver. 
La validación debe estar en el método validate() y lanzar ValidationException 
con el campo 'fechaNacimiento' si no cumple."
```

#### Crear Endpoint Completo
```
"Implementa un endpoint GET /api/conductores/search?licencia=ABC123 para buscar 
conductores por número de licencia. Incluye:
1. Caso de uso GetDriverByLicenseUseCase
2. Método en DriverController
3. Ruta en driverRoutes.ts
4. Tests de integración"
```

#### Refactorización
```
"Refactoriza DriverController para usar un middleware de validación común 
que verifique campos requeridos antes de llegar al controlador."
```

#### Tests
```
"Crea tests de integración para el endpoint PUT /api/conductores/:id 
que cubran:
- Actualización exitosa
- Conductor no encontrado (404)
- Email inválido (400)
- Licencia duplicada (400)"
```

### Comandos para Mantener Calidad

#### Verificar Arquitectura
```
"Verifica que no haya violaciones de arquitectura DDD en el proyecto. 
Revisa que:
- Domain no importe de Infrastructure
- Domain no importe de Application
- No se usen Error genéricos, solo excepciones específicas"
```

#### Mejorar Cobertura
```
"Revisa la cobertura de tests y crea tests unitarios para las validaciones 
de la entidad Driver."
```

#### Consistencia de Código
```
"Verifica que todas las excepciones sigan el mismo patrón:
- Extienden Error
- Tienen name property
- Implementan Error.captureStackTrace
- Están organizadas por carpetas de contexto"
```

---

## Convenciones del Proyecto

### Naming Conventions

#### Archivos y Clases
```typescript
// Entidades: PascalCase, singular
Driver.ts → export class Driver

// Use Cases: PascalCase con sufijo UseCase
CreateDriverUseCase.ts → export class CreateDriverUseCase

// DTOs: PascalCase con sufijo DTO
CreateDriverDTO.ts → export interface CreateDriverDTO

// Excepciones: PascalCase con sufijo Exception
DriverNotFoundException.ts → export class DriverNotFoundException

// Controllers: PascalCase con sufijo Controller
DriverController.ts → export class DriverController

// Repositories: PascalCase con sufijo Repository
DriverRepository.ts → export interface DriverRepository
MongoDriverRepository.ts → export class MongoDriverRepository
```

#### Variables y Métodos
```typescript
// Variables: camelCase
const driverRepository = ...
const existingDriver = ...

// Métodos: camelCase, verbos descriptivos
async execute(dto: CreateDriverDTO): Promise<Driver>
async findById(id: string): Promise<Driver | null>
private validate(): void
```

#### Carpetas
```
// Carpetas: kebab-case o camelCase según contexto
use-cases/           # kebab-case para carpetas estructurales
driver/              # lowercase para entidades/módulos
```

### Estructura de Archivos Barrel

**Cada carpeta de módulo debe tener un `index.ts`**:

```typescript
// src/domain/exceptions/driver/index.ts
export * from './DuplicateLicenseException';
export * from './DriverNotFoundException';
export * from './DriverUpdateException';
export * from './DriverDeleteException';
```

**Uso**:
```typescript
// ❌ NO hacer:
import { DriverNotFoundException } from '../../../domain/exceptions/driver/DriverNotFoundException';

// ✅ SÍ hacer:
import { DriverNotFoundException } from '../../../domain/exceptions/driver';
// o mejor aún:
import { DriverNotFoundException } from '../../../domain/exceptions';
```

### Organización de Excepciones

#### Domain Exceptions
Por entidad o contexto de negocio:
```
src/domain/exceptions/
├── driver/
│   ├── DuplicateLicenseException.ts
│   ├── DriverNotFoundException.ts
│   ├── DriverUpdateException.ts
│   └── DriverDeleteException.ts
├── vehicle/                    # Futuro
│   ├── DuplicatePlateException.ts
│   └── VehicleNotFoundException.ts
└── validation/
    └── ValidationException.ts
```

#### Infrastructure Exceptions
Por servicio técnico:
```
src/infrastructure/exceptions/
├── database/
│   └── DatabaseNotConnectedException.ts
├── http/                       # Futuro
│   └── HttpTimeoutException.ts
└── cache/                      # Futuro
    └── CacheConnectionException.ts
```

### Organización de DTOs

Por entidad en carpetas separadas:
```
src/application/dtos/
├── driver/
│   ├── CreateDriverDTO.ts
│   ├── UpdateDriverDTO.ts
│   └── index.ts
├── vehicle/                    # Futuro
│   ├── CreateVehicleDTO.ts
│   ├── UpdateVehicleDTO.ts
│   └── index.ts
└── index.ts
```

### Tests

```
test/
├── unit/                       # Tests unitarios (sin DB)
│   ├── domain/                 # Entidades, Value Objects
│   └── application/            # Use Cases con mocks
├── integration/                # Tests de integración (con DB in-memory)
│   ├── api/                    # Tests de endpoints
│   └── repositories/           # Tests de repositorios
└── helpers/
    └── testDatabase.ts         # Utilities para tests
```

---

## Reglas de Arquitectura

### ❌ NO Hacer (Violaciones de Arquitectura)

```typescript
// ❌ NO importar Infrastructure en Domain
// src/domain/entities/Driver.ts
import { MongoDriverRepository } from '../../infrastructure/...'; // ¡MAL!

// ❌ NO poner lógica de negocio en Controllers
// src/infrastructure/api/controllers/DriverController.ts
async create(req: Request, res: Response) {
  if (req.body.licencia === 'ABC123') {  // ¡MAL! Lógica en controller
    throw new Error('Licencia no permitida');
  }
}

// ❌ NO crear DTOs en Domain
// src/domain/entities/CreateDriverDTO.ts  // ¡MAL! DTOs van en application

// ❌ NO usar Error genérico
throw new Error('Conductor no encontrado');  // ¡MAL! Usar excepción específica

// ❌ NO hardcodear strings de error
if (error.message === 'Conductor no encontrado') { ... }  // ¡MAL! Usar instanceof

// ❌ NO mezclar capas
// src/domain/entities/Driver.ts
constructor(private mongoDb: MongoClient) { ... }  // ¡MAL! Domain no conoce MongoDB
```

### ✅ SÍ Hacer (Buenas Prácticas)

```typescript
// ✅ SÍ mantener Domain puro
// src/domain/entities/Driver.ts
export class Driver {
  constructor(
    public readonly id: string,
    public readonly nombre: string
    // Solo primitivos y otros objetos de dominio
  ) {
    this.validate();
  }
}

// ✅ SÍ usar excepciones específicas
throw new DriverNotFoundException(id);
throw new DuplicateLicenseException(licencia);

// ✅ SÍ verificar excepciones con instanceof
if (error instanceof DriverNotFoundException) {
  res.status(404).json({ error: error.message });
}

// ✅ SÍ organizar por carpetas de contexto
src/domain/exceptions/driver/         # Excepciones de Driver
src/domain/exceptions/vehicle/        # Excepciones de Vehicle
src/infrastructure/exceptions/database/  # Excepciones de DB

// ✅ SÍ inyectar dependencias por constructor
export class CreateDriverUseCase {
  constructor(private repository: DriverRepository) {}  // Interface, no implementación
}

// ✅ SÍ usar interfaces para repositorios
export interface DriverRepository {  // En domain
  save(driver: Driver): Promise<Driver>;
}
export class MongoDriverRepository implements DriverRepository {  // En infrastructure
  // implementación
}
```

### Flujo de Dependencias Correcto

```
✅ Correcto:
Infrastructure → Application → Domain
Controller → UseCase → Entity
MongoRepo → RepoInterface (implementa)

❌ Incorrecto:
Domain → Application  ⛔
Domain → Infrastructure  ⛔
Entity → Controller  ⛔
```

---

## Patrones de Código

### Crear una Entidad

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
    public readonly fechaCreacion: Date = new Date(),
    public readonly fechaActualizacion: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.plate || this.plate.trim().length === 0) {
      throw new ValidationException('La placa es requerida', 'plate');
    }
    if (this.year < 1900 || this.year > new Date().getFullYear() + 1) {
      throw new ValidationException('Año inválido', 'year');
    }
    // Más validaciones...
  }

  public static create(
    plate: string,
    brand: string,
    model: string,
    year: number,
    id?: string
  ): Vehicle {
    return new Vehicle(
      id || this.generateId(),
      plate,
      brand,
      model,
      year,
      new Date(),
      new Date()
    );
  }

  public update(data: Partial<{
    plate: string;
    brand: string;
    model: string;
    year: number;
  }>): Vehicle {
    return new Vehicle(
      this.id,
      data.plate ?? this.plate,
      data.brand ?? this.brand,
      data.model ?? this.model,
      data.year ?? this.year,
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
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    };
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Crear un Caso de Uso

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
      dto.year
    );

    // 3. Persistir
    return await this.vehicleRepository.save(vehicle);
  }
}
```

### Crear una Excepción

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
```

### Crear un DTO

```typescript
// src/application/dtos/vehicle/CreateVehicleDTO.ts
export interface CreateVehicleDTO {
  plate: string;
  brand: string;
  model: string;
  year: number;
}
```

---

## Checklist para Nuevas Features

Cuando Claude agregue una nueva feature, verificar:

- [ ] Entidad creada en `src/domain/entities/` con validaciones
- [ ] Interface de repositorio en `src/domain/repositories/`
- [ ] Excepciones específicas en `src/domain/exceptions/{entity}/`
- [ ] DTOs en `src/application/dtos/{entity}/`
- [ ] Casos de uso en `src/application/use-cases/{entity}/`
- [ ] Implementación de repositorio en `src/infrastructure/persistence/mongodb/repositories/`
- [ ] Controller en `src/infrastructure/api/controllers/`
- [ ] Routes en `src/infrastructure/api/routes/`
- [ ] Tests de integración en `test/integration/api/`
- [ ] Archivos barrel (`index.ts`) en todas las carpetas
- [ ] Sin violaciones de arquitectura domain driven design (domain no importa de infrastructure ni application)
- [ ] Evitar `Error` genéricos en domain y application

---

## Tips para Claude

### Al Crear Archivos Nuevos
1. Seguir **exactamente** la estructura de archivos existentes
2. Usar **imports relativos** correctos (`../../../domain/...`)
3. Agregar archivo al **barrel export** (`index.ts`)
4. Mantener **consistencia** con archivos similares

### Al Modificar Código
1. Leer el archivo completo primero con `@archivo.ts`
2. Entender el **patrón actual** antes de cambiar
3. Mantener el **mismo estilo** de código
4. Actualizar **tests** si es necesario

### Al Resolver Errores
1. Verificar **imports** (muchas veces es solo eso)
2. Revisar que no falten **archivos barrel** (`index.ts`)
3. Confirmar que se usan **excepciones específicas**, no `Error`
4. Validar que no haya **violaciones de arquitectura**

---

## Recursos Adicionales

- [Arquitectura DDD](ARCHITECTURE.md) - Diagramas y estructura detallada
- [Patrones de Código](PATTERNS.md) - Ejemplos completos
- [Guía de Desarrollo](DEVELOPMENT.md) - Setup y workflow
- [Testing](TESTING.md) - Estrategia de tests
- [API Reference](API-REFERENCE.md) - Documentación de endpoints

---

**¿Listo para empezar?** Prueba con:
```
"Claude, crea una nueva entidad Vehicle siguiendo el patrón de Driver"
```
