# Excepciones de Infraestructura

Este documento describe todas las excepciones específicas de la capa de infraestructura implementadas en el proyecto.

## Estructura

Las excepciones de infraestructura están organizadas por servicio/componente:

```
src/infrastructure/exceptions/
├── database/                  # Excepciones de base de datos
│   ├── DatabaseNotConnectedException.ts
│   └── index.ts
├── index.ts                   # Barrel principal
└── README.md
```

Todas las excepciones de infraestructura pueden ser importadas desde el barrel principal:

```typescript
import { DatabaseNotConnectedException } from '../../exceptions';
```

O desde sus carpetas específicas:

```typescript
// Solo excepciones de database
import { DatabaseNotConnectedException } from '../../exceptions/database';
```

## Catálogo de Excepciones

### 📁 Database Exceptions

Excepciones relacionadas con operaciones de base de datos.

#### 1. DatabaseNotConnectedException

**Descripción**: Se lanza cuando se intenta acceder a la base de datos sin establecer conexión.

**Uso**:
```typescript
throw new DatabaseNotConnectedException();
```

**Mensaje**: `Database not connected`

**Ubicación de uso**:
- `MongoConnection.getDatabase()`: Al intentar obtener la instancia de DB sin conexión activa

**Ejemplo completo**:
```typescript
public getDatabase(): Db {
  if (!this.db) {
    throw new DatabaseNotConnectedException();
  }
  return this.db;
}
```

---

## Principios de Diseño

### Separación de Capas

Las excepciones de infraestructura están separadas de las excepciones de dominio por las siguientes razones:

1. **Responsabilidad**: 
   - **Dominio**: Excepciones de lógica de negocio
   - **Infraestructura**: Excepciones técnicas y de servicios

2. **Acoplamiento**: 
   - El dominio NO debe depender de la infraestructura
   - La infraestructura SÍ puede depender del dominio

3. **Claridad**: 
   - Facilita identificar si un error es de negocio o técnico
   - Mejora la arquitectura limpia (Clean Architecture)

### ¿Dónde agregar una excepción?

**En `src/infrastructure/exceptions/` cuando:**
- ❌ NO está relacionada con reglas de negocio
- ✅ Es un problema técnico (conexión, timeout, etc.)
- ✅ Viene de servicios externos (APIs, DB, colas, etc.)
- ✅ Es específica de una implementación técnica

**Ejemplos:**
- ✅ `DatabaseNotConnectedException` - Infraestructura
- ✅ `ConnectionTimeoutException` - Infraestructura
- ✅ `ExternalAPIException` - Infraestructura
- ❌ `DriverNotFoundException` - Dominio
- ❌ `ValidationException` - Dominio

---

## Organización por Carpetas

### 📁 `database/`
Excepciones relacionadas con operaciones de base de datos.

**¿Cuándo agregar una excepción aquí?**
- Problemas de conexión a la base de datos
- Errores de transacciones
- Timeouts de consultas
- Ejemplos: `DatabaseConnectionException`, `TransactionFailedException`

### 📁 Futuras Carpetas (ejemplos)

**`http/`**: Excepciones relacionadas con clientes HTTP
- `HttpTimeoutException`
- `HttpBadRequestException`
- `HttpUnauthorizedException`

**`messaging/`**: Excepciones de sistemas de mensajería
- `QueueConnectionException`
- `MessagePublishException`

**`cache/`**: Excepciones de sistemas de caché
- `CacheConnectionException`
- `CacheKeyNotFoundException`

**`storage/`**: Excepciones de almacenamiento de archivos
- `FileUploadException`
- `StorageFullException`

---

## Manejo de Excepciones

### En la Capa de Aplicación

Las excepciones de infraestructura deben ser capturadas y traducidas a excepciones de dominio cuando sea apropiado:

```typescript
// ❌ MAL - Exponer excepción de infraestructura al dominio
async execute(id: string): Promise<Driver> {
  return await this.repository.findById(id); // Puede lanzar DatabaseNotConnectedException
}

// ✅ BIEN - Traducir a excepción de dominio
async execute(id: string): Promise<Driver> {
  try {
    return await this.repository.findById(id);
  } catch (error) {
    if (error instanceof DatabaseNotConnectedException) {
      throw new RepositoryException('No se puede acceder al repositorio de conductores');
    }
    throw error;
  }
}
```

### En la Capa de Presentación (Controladores)

Los controladores pueden manejar excepciones de infraestructura para devolver códigos HTTP apropiados:

```typescript
try {
  const driver = await this.getDriverUseCase.execute(id);
  res.status(200).json(driver);
} catch (error) {
  if (error instanceof DatabaseNotConnectedException) {
    res.status(503).json({ error: 'Servicio temporalmente no disponible' });
  } else if (error instanceof DriverNotFoundException) {
    res.status(404).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
```

---

## Códigos HTTP Recomendados

Para excepciones de infraestructura:

- `503 Service Unavailable`: Problemas de conexión (DB, APIs externas)
- `504 Gateway Timeout`: Timeouts en servicios externos
- `500 Internal Server Error`: Otros errores técnicos

---

## Convenciones

1. Todas las excepciones extienden `Error`
2. Se implementa `Error.captureStackTrace` para V8
3. Se establece la propiedad `name` con el nombre de la clase
4. Los mensajes son descriptivos pero NO exponen detalles técnicos sensibles
5. Se exportan desde el barrel principal (`index.ts`)
6. Se organizan por servicio/componente en carpetas separadas

---

## Guía para Agregar Nuevas Excepciones

### Paso 1: Identificar el Componente

Determina a qué componente pertenece la excepción:
- `database/` - Base de datos
- `http/` - Cliente HTTP
- `messaging/` - Sistema de mensajería
- etc.

### Paso 2: Crear la Excepción

```typescript
// src/infrastructure/exceptions/database/QueryTimeoutException.ts
export class QueryTimeoutException extends Error {
  constructor(query: string, timeout: number) {
    super(`Query timed out after ${timeout}ms: ${query}`);
    this.name = 'QueryTimeoutException';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryTimeoutException);
    }
  }
}
```

### Paso 3: Actualizar el Barrel de la Carpeta

```typescript
// src/infrastructure/exceptions/database/index.ts
export * from './DatabaseNotConnectedException';
export * from './QueryTimeoutException';  // Nueva
```

### Paso 4: Usar la Excepción

```typescript
// En el repositorio o servicio de infraestructura
if (executionTime > timeout) {
  throw new QueryTimeoutException(query, timeout);
}
```

---

## Beneficios

1. **Separación de responsabilidades**: Infraestructura separada del dominio
2. **Arquitectura limpia**: Respeta los principios de Clean Architecture
3. **Debugging mejorado**: Fácil identificar si el error es técnico o de negocio
4. **Mantenibilidad**: Código organizado por componentes técnicos
5. **Escalabilidad**: Fácil agregar nuevos servicios de infraestructura
6. **Testabilidad**: Mockear excepciones de infraestructura en tests de dominio
