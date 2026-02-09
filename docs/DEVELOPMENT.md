# Guía de Desarrollo

Guía completa para desarrolladores que trabajan en este proyecto.

## Setup del Entorno

### Prerrequisitos

- **Node.js** v18 o superior
- **MongoDB** v6 o superior
- **npm** (incluido con Node.js)
- **Git**
- **Editor recomendado**: VS Code con extensiones TypeScript

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd nodejs-ddd-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/transport-db
NODE_ENV=development
```

4. **Iniciar MongoDB**

**macOS (Homebrew)**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongod
```

**Docker**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Verificar instalación**
```bash
npm test
```

---

## Comandos de Desarrollo

### Desarrollo
```bash
# Iniciar servidor en modo desarrollo (hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

### Testing
```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Solo tests de integración
npm run test:integration

# Coverage
npm test -- --coverage
```

### Linting y Formato
```bash
# Ejecutar linter (si está configurado)
npm run lint

# Auto-fix de linting
npm run lint:fix
```

---

## Workflow de Desarrollo

### 1. Crear Nueva Feature

**Pasos:**
1. Crear rama desde `main`
2. Implementar feature siguiendo arquitectura DDD
3. Agregar tests
4. Ejecutar tests y verificar cobertura
5. Commit y push
6. Crear Pull Request

**Ejemplo: Agregar entidad Vehicle**

```bash
# 1. Crear rama
git checkout -b feature/vehicle-entity

# 2. Crear archivos siguiendo estructura
# - src/domain/entities/Vehicle.ts
# - src/domain/repositories/VehicleRepository.ts
# - src/domain/exceptions/vehicle/
# - src/application/use-cases/vehicle/
# - src/application/dtos/vehicle/
# - src/infrastructure/api/controllers/VehicleController.ts
# - src/infrastructure/api/routes/vehicleRoutes.ts
# - src/infrastructure/persistence/mongodb/repositories/MongoVehicleRepository.ts
# - test/integration/api/vehicle.test.ts

# 3. Ejecutar tests
npm test

# 4. Commit
git add .
git commit -m "feat: add Vehicle entity with CRUD operations"

# 5. Push
git push origin feature/vehicle-entity
```

### 2. Estructura de Commits

Seguir convención de commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

**Ejemplos:**
```bash
feat(domain): add Vehicle entity with validations
fix(api): correct error handling in DriverController
docs(architecture): update DDD diagrams
test(integration): add tests for Vehicle endpoints
refactor(use-cases): extract validation logic
```

### 3. Pull Request

**Checklist antes de crear PR:**
- [ ] Todos los tests pasan
- [ ] Coverage no disminuyó
- [ ] Código sigue convenciones del proyecto
- [ ] Documentación actualizada
- [ ] Sin violaciones de arquitectura DDD
- [ ] Archivos barrel (`index.ts`) creados
- [ ] Sin `Error` genéricos, solo excepciones específicas

**Template de PR:**
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Nueva feature
- [ ] Bug fix
- [ ] Refactorización
- [ ] Documentación

## Checklist
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Sigue arquitectura DDD

## Tests
Descripción de tests agregados
```

---

## Convenciones de Código

### TypeScript

**tsconfig.json configurado con:**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "esModuleInterop": true
}
```

### Naming Conventions

**Archivos:**
- Entidades: `PascalCase.ts` (ej: `Driver.ts`)
- Casos de uso: `PascalCaseUseCase.ts`
- DTOs: `PascalCaseDTO.ts`
- Controllers: `PascalCaseController.ts`
- Tests: `*.test.ts`

**Código:**
```typescript
// Clases: PascalCase
class DriverController { }

// Interfaces: PascalCase
interface DriverRepository { }

// Variables: camelCase
const driverRepository = ...

// Constantes: UPPER_SNAKE_CASE
const MAX_DRIVERS = 100;

// Funciones: camelCase
function findById() { }

// Private methods: camelCase con prefijo
private _validateData() { }
```

### Imports

**Orden de imports:**
```typescript
// 1. Librerías externas
import { Request, Response } from 'express';

// 2. Dominio
import { Driver } from '../../../domain/entities/Driver';
import { DriverRepository } from '../../../domain/repositories/DriverRepository';

// 3. Aplicación
import { CreateDriverUseCase } from '../../../application/use-cases/driver/CreateDriverUseCase';

// 4. DTOs
import { CreateDriverDTO } from '../../../application/dtos/driver';

// 5. Excepciones
import { DriverNotFoundException } from '../../../domain/exceptions';
```

**Usar imports desde barrels:**
```typescript
// ✅ Correcto
import { DriverNotFoundException, ValidationException } from '../../../domain/exceptions';

// ❌ Incorrecto
import { DriverNotFoundException } from '../../../domain/exceptions/driver/DriverNotFoundException';
```

### Formato de Código

**Indentación:** 2 espacios

**Strings:** Comillas simples `'` excepto en JSX/templates

**Punto y coma:** Siempre usar `;`

**Trailing comma:** Sí en objetos y arrays multilínea

```typescript
// ✅ Correcto
const driver = {
  nombre: 'Juan',
  apellido: 'Pérez',
};

// ❌ Incorrecto
const driver = {
  nombre: 'Juan',
  apellido: 'Pérez'
}
```

---

## Arquitectura DDD

### Reglas de Oro

1. **Domain no depende de nadie**
   - No importar de `infrastructure`
   - No importar de `application`
   - Solo primitivos y objetos de dominio

2. **Application depende solo de Domain**
   - Puede usar entidades
   - Puede usar interfaces de repositorios
   - No puede usar implementaciones de repositorios

3. **Infrastructure depende de Application y Domain**
   - Implementa interfaces del dominio
   - Puede importar de cualquier capa

### Flujo de Creación de Features

**Para agregar una nueva entidad (ej: Vehicle):**

```
1. Domain Layer
   ├── entities/Vehicle.ts              # Entidad con validaciones
   ├── repositories/VehicleRepository.ts # Interface
   └── exceptions/vehicle/               # Excepciones específicas
       ├── DuplicatePlateException.ts
       ├── VehicleNotFoundException.ts
       └── index.ts

2. Application Layer
   ├── dtos/vehicle/                     # DTOs
   │   ├── CreateVehicleDTO.ts
   │   ├── UpdateVehicleDTO.ts
   │   └── index.ts
   └── use-cases/vehicle/                # Casos de uso
       ├── CreateVehicleUseCase.ts
       ├── GetVehicleUseCase.ts
       ├── UpdateVehicleUseCase.ts
       ├── DeleteVehicleUseCase.ts
       └── GetAllVehiclesUseCase.ts

3. Infrastructure Layer
   ├── persistence/mongodb/repositories/
   │   └── MongoVehicleRepository.ts     # Implementación
   └── api/
       ├── controllers/
       │   └── VehicleController.ts
       └── routes/
           └── vehicleRoutes.ts

4. Tests
   └── integration/api/
       └── vehicle.test.ts               # Tests de integración
```

---

## Debugging

### VS Code Launch Configuration

Crear `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debugging con console.log

```typescript
// En desarrollo
console.log('[DEBUG] Driver:', driver);

// En producción usar logger
// logger.debug('Driver', { driver });
```

### Debugging de Tests

```typescript
// Ejecutar solo un test
it.only('should create driver', async () => { ... });

// Saltar un test
it.skip('test to fix later', async () => { ... });

// Ver output completo
npm test -- --verbose
```

---

## Bases de Datos

### MongoDB Local

**Conectar con Mongo Shell:**
```bash
mongosh mongodb://localhost:27017/transport-db
```

**Ver colecciones:**
```javascript
show collections
db.drivers.find().pretty()
```

**Limpiar datos:**
```javascript
db.drivers.deleteMany({})
```

### MongoDB en Tests

Los tests usan `mongodb-memory-server` - no afectan la DB local.

---

## Troubleshooting

### Error: "Port already in use"
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O cambiar puerto en .env
PORT=3001
```

### Error: "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB esté corriendo
brew services list | grep mongodb
# o
systemctl status mongod

# Reiniciar MongoDB
brew services restart mongodb-community
# o
sudo systemctl restart mongod
```

### Error: "Module not found"
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Tests fallan después de cambios
```bash
# Limpiar cache de Jest
npm test -- --clearCache

# Ejecutar tests sin cache
npm test -- --no-cache
```

---

## Herramientas Recomendadas

### VS Code Extensions
- **ESLint**: Linting de JavaScript/TypeScript
- **Prettier**: Formateo de código
- **Jest**: Soporte para tests
- **MongoDB for VS Code**: Explorar MongoDB
- **Thunder Client**: Cliente REST integrado
- **GitLens**: Mejor integración con Git

### Utilidades de Línea de Comandos
- **curl** o **httpie**: Probar endpoints
- **jq**: Procesar JSON en terminal
- **mongosh**: Cliente de MongoDB

### Ejemplo de prueba con curl:
```bash
# Health check
curl http://localhost:3000/health

# Crear conductor
curl -X POST http://localhost:3000/api/conductores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "licencia": "ABC123",
    "telefono": "+34612345678",
    "email": "juan@test.com",
    "fechaNacimiento": "1990-01-01"
  }'

# Listar conductores
curl http://localhost:3000/api/conductores | jq
```

---

## Recursos Adicionales

### Documentación del Proyecto
- [Arquitectura](ARCHITECTURE.md)
- [Trabajar con Claude AI](WORKING-WITH-CLAUDE.md)
- [Testing](TESTING.md)
- [Patrones](PATTERNS.md)
- [API Reference](API-REFERENCE.md)

### Aprendizaje
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## FAQ

**P: ¿Dónde agrego una nueva validación?**  
R: En el método `validate()` de la entidad, lanzando `ValidationException`.

**P: ¿Cómo creo una nueva excepción?**  
R: Ver [Patrones de Código](PATTERNS.md#excepciones).

**P: ¿Qué hago si los tests están lentos?**  
R: Verificar que uses `mongodb-memory-server`. No debería conectar a MongoDB real.

**P: ¿Puedo usar `Error` genérico?**  
R: No. Siempre usar excepciones específicas del dominio o infraestructura.

**P: ¿Dónde va la lógica de negocio?**  
R: En las entidades (validaciones) y casos de uso (orquestación). Nunca en controllers.

---

**¿Listo para desarrollar?** Empieza con la [Guía de Claude AI](WORKING-WITH-CLAUDE.md) para trabajar más eficientemente.
