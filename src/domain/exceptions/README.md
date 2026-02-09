# Excepciones del Dominio

Este documento describe todas las excepciones específicas del dominio implementadas en el proyecto.

## Estructura

Las excepciones están organizadas por contexto en diferentes carpetas:

```
src/domain/exceptions/
├── driver/                    # Excepciones específicas de Driver
│   ├── DuplicateLicenseException.ts
│   ├── DriverNotFoundException.ts
│   ├── DriverUpdateException.ts
│   ├── DriverDeleteException.ts
│   └── index.ts
├── validation/                # Excepciones de validación
│   ├── ValidationException.ts
│   └── index.ts
├── index.ts                   # Barrel principal
└── README.md
```

> **Nota**: Las excepciones de infraestructura se encuentran en `src/infrastructure/exceptions/`

Todas las excepciones de dominio pueden ser importadas desde el barrel principal:

```typescript
import { 
  DuplicateLicenseException, 
  DriverNotFoundException,
  ValidationException 
} from '../../../domain/exceptions';
```

O desde sus carpetas específicas:

```typescript
// Importar solo excepciones de driver
import { DriverNotFoundException } from '../../../domain/exceptions/driver';

// Importar solo excepciones de validación
import { ValidationException } from '../../../domain/exceptions/validation';
```

## Catálogo de Excepciones

### 📁 Driver Exceptions

Excepciones específicas relacionadas con la entidad Driver.

#### 1. DuplicateLicenseException

**Descripción**: Se lanza cuando se intenta crear o actualizar un conductor con una licencia que ya existe en el sistema.

**Uso**:
```typescript
throw new DuplicateLicenseException(licencia);
```

**Mensaje**: `Ya existe un conductor con la licencia: ${licencia}`

**Casos de uso**:
- `CreateDriverUseCase`: Al crear un conductor con licencia duplicada
- `UpdateDriverUseCase`: Al actualizar la licencia a una ya existente

---

#### 2. DriverNotFoundException

**Descripción**: Se lanza cuando se busca un conductor por ID y no se encuentra.

**Uso**:
```typescript
throw new DriverNotFoundException(id);
```

**Mensaje**: `Conductor con ID ${id} no encontrado`

**Casos de uso**:
- `GetDriverUseCase`: Al buscar un conductor que no existe
- `UpdateDriverUseCase`: Al intentar actualizar un conductor inexistente
- `DeleteDriverUseCase`: Al intentar eliminar un conductor inexistente

---

#### 3. DriverUpdateException

**Descripción**: Se lanza cuando falla la operación de actualización de un conductor.

**Uso**:
```typescript
throw new DriverUpdateException(id);
// o con razón específica
throw new DriverUpdateException(id, 'Database connection failed');
```

**Mensaje**: 
- Sin razón: `Error al actualizar el conductor con ID ${id}`
- Con razón: `Error al actualizar el conductor con ID ${id}: ${reason}`

**Casos de uso**:
- `UpdateDriverUseCase`: Cuando el repositorio no puede actualizar el conductor

---

#### 4. DriverDeleteException

**Descripción**: Se lanza cuando falla la operación de eliminación de un conductor.

**Uso**:
```typescript
throw new DriverDeleteException(id);
// o con razón específica
throw new DriverDeleteException(id, 'Database connection failed');
```

**Mensaje**: 
- Sin razón: `Error al eliminar el conductor con ID ${id}`
- Con razón: `Error al eliminar el conductor con ID ${id}: ${reason}`

**Casos de uso**:
- `DeleteDriverUseCase`: Cuando el repositorio no puede eliminar el conductor

---

### 📁 Validation Exceptions

Excepciones genéricas de validación de datos del dominio.

#### 5. ValidationException

**Descripción**: Se lanza cuando los datos de entrada no cumplen con las reglas de validación del dominio.

**Uso**:
```typescript
throw new ValidationException('El email no es válido', 'email');
```

**Propiedades**:
- `message`: Mensaje descriptivo del error
- `field` (opcional): Nombre del campo que falló la validación

**Casos de uso**:
- `Driver` entity: Validación de todos los campos del conductor
  - Nombre requerido
  - Apellido requerido
  - Licencia requerida
  - Email válido
  - Teléfono requerido
  - Fecha de nacimiento requerida

---

## Excepciones de Infraestructura

Las excepciones de infraestructura se han movido a `src/infrastructure/exceptions/`.

Ver documentación completa en: [src/infrastructure/exceptions/README.md](../../../infrastructure/exceptions/README.md)

---

## Manejo en el Controlador

El `DriverController` maneja estas excepciones de la siguiente manera:

```typescript
// 404 - Not Found
if (error instanceof DriverNotFoundException) {
  res.status(404).json({ error: error.message });
}

// 400 - Bad Request
if (error instanceof DuplicateLicenseException) {
  res.status(400).json({ error: error.message });
}

if (error instanceof ValidationException) {
  res.status(400).json({ error: error.message, field: error.field });
}

if (error instanceof DriverUpdateException) {
  res.status(400).json({ error: error.message });
}

if (error instanceof DriverDeleteException) {
  res.status(400).json({ error: error.message });
}
```

## Beneficios

1. **Tipado fuerte**: Uso de `instanceof` para identificar errores específicos
2. **Debugging mejorado**: Stack traces correctos y nombres de excepciones claros
3. **Código mantenible**: Separación clara entre tipos de errores
4. **Mensajes descriptivos**: Incluyen contexto relevante (IDs, campos, etc.)
5. **Manejo específico**: Respuestas HTTP adecuadas según el tipo de error
6. **Extensibilidad**: Fácil agregar nuevas excepciones cuando sea necesario

## Convenciones

1. Todas las excepciones extienden `Error`
2. Se implementa `Error.captureStackTrace` para V8
3. Se establece la propiedad `name` con el nombre de la clase
4. Los mensajes incluyen contexto relevante (IDs, valores, etc.)
5. Se exportan desde el barrel principal (`index.ts`)

## Organización por Carpetas

Las excepciones están organizadas por su contexto y responsabilidad:

### 📁 `driver/`
Contiene excepciones específicas de la entidad Driver y sus operaciones CRUD. Estas excepciones están directamente relacionadas con la lógica de negocio del dominio Driver.

**¿Cuándo agregar una excepción aquí?**
- Cuando la excepción es específica para operaciones de Driver
- Cuando representa un error de negocio relacionado con conductores
- Ejemplo: `VehicleAssignedException` (cuando un conductor tiene vehículos asignados)

### 📁 `validation/`
Contiene excepciones genéricas de validación que pueden ser reutilizadas por múltiples entidades del dominio.

**¿Cuándo agregar una excepción aquí?**
- Cuando la excepción es genérica y aplicable a cualquier entidad
- Cuando representa un error de validación de datos
- Ejemplo: `InvalidFormatException`, `RequiredFieldException`

---

**Excepciones de Infraestructura**: Las excepciones técnicas y de infraestructura se encuentran en `src/infrastructure/exceptions/` y están organizadas de manera similar (por ejemplo: `database/`, `http/`, `external-services/`).

---

### Guía para Nuevas Entidades

Si agregas una nueva entidad (ej. `Vehicle`), crea su carpeta de excepciones:

```
src/domain/exceptions/
├── vehicle/                   # Nueva carpeta
│   ├── VehicleNotFoundException.ts
│   ├── VehicleDuplicatePlateException.ts
│   └── index.ts
```

Y actualiza el barrel principal:

```typescript
// src/domain/exceptions/index.ts
export * from './driver';
export * from './vehicle';      // Nuevo
export * from './validation';
```

**Nota**: Las excepciones de infraestructura deben ir en `src/infrastructure/exceptions/` siguiendo la misma estructura de carpetas.
